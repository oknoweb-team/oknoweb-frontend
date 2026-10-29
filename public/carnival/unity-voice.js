/*
 * unity-voice.js  -  browser side of the proximity voice chat.
 *
 * Load as a normal <script> in your WebGL template, AFTER the livekit-client UMD file:
 *   <script src="livekit-client.umd.js"></script>
 *   <script src="unity-voice.js"></script>
 *
 * Needs livekit-client v2.x (uses room.remoteParticipants / participant.trackPublications).
 * Unity talks to this through Assets/Plugins/WebGL/UnityVoice.jslib.
 *
 * Audio path per speaker:
 *   LiveKit audio track -> MediaStream -> GainNode (distance volume) -> StereoPanner (left/right) -> master -> speakers
 */
(function () {
  'use strict';

  var STATE_IDLE = 0, STATE_CONNECTING = 1, STATE_CONNECTED = 2, STATE_FAILED = 3;

  var room = null;
  var state = STATE_IDLE;
  var ctx = null;
  var master = null;
  var masterVol = 1;
  var peers = new Map();        // identity -> { el, src, gain, pan }
  var wanted = new Set();       // identities (slots) we currently want to hear
  var desiredMic = false;
  var micStatus = 0;           // 0 off, 1 starting (waiting for permission), 2 on, 3 blocked/failed
  var micChain = Promise.resolve();
  var connectToken = 0;         // invalidates stale async connects
  var inited = false;

  function log() {
    var a = Array.prototype.slice.call(arguments);
    a.unshift('[Voice]');
    console.log.apply(console, a);
  }

  // ---------- audio context ----------

  function ensureCtx() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC({ latencyHint: 'interactive' });
      master = ctx.createGain();
      master.gain.value = masterVol;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume().catch(function () {});
    return ctx;
  }

  function init() {
    if (inited) return;
    inited = true;

    // Browsers keep audio suspended until the user interacts with the page.
    var resume = function () {
      if (ctx && ctx.state === 'suspended') ctx.resume().catch(function () {});
    };
    ['pointerdown', 'mousedown', 'keydown', 'touchstart', 'click'].forEach(function (e) {
      document.addEventListener(e, resume, true);
    });

    try { ensureCtx(); } catch (e) { console.warn('[Voice] AudioContext unavailable', e); }
  }

  // ---------- peers (remote speakers) ----------

  function attach(track, participant) {
    if (!track || track.kind !== 'audio') return;
    var id = participant.identity;
    detach(id);

    var c = ensureCtx();
    var stream = new MediaStream([track.mediaStreamTrack]);

    // Chrome only delivers remote WebRTC audio to Web Audio if the stream is also
    // attached to a media element. Muted, so it adds no sound by itself.
    var el = new Audio();
    el.srcObject = stream;
    el.muted = true;
    el.autoplay = true;
    var pr = el.play();
    if (pr && pr.catch) pr.catch(function () {});

    var src = c.createMediaStreamSource(stream);
    var gain = c.createGain();
    gain.gain.value = 0;                       // silent until Unity sends a distance
    var pan = c.createStereoPanner ? c.createStereoPanner() : null;

    src.connect(gain);
    if (pan) { gain.connect(pan); pan.connect(master); }
    else { gain.connect(master); }

    peers.set(id, { el: el, src: src, gain: gain, pan: pan });
  }

  function detach(id) {
    var p = peers.get(id);
    if (!p) return;
    try { p.src.disconnect(); } catch (e) {}
    try { p.gain.disconnect(); } catch (e) {}
    if (p.pan) { try { p.pan.disconnect(); } catch (e) {} }
    try { p.el.srcObject = null; } catch (e) {}
    peers.delete(id);
  }

  function cleanupPeers() {
    Array.from(peers.keys()).forEach(detach);
  }

  // ---------- subscriptions ----------

  function applySub(pub, participant) {
    if (!pub || pub.kind !== 'audio') return;
    var want = wanted.has(participant.identity);
    try {
      if (want !== !!pub.isSubscribed) pub.setSubscribed(want);
    } catch (e) { /* publication may be mid-update; next event retries */ }
  }

  function applyAllSubs() {
    if (!room) return;
    room.remoteParticipants.forEach(function (p) {
      p.trackPublications.forEach(function (pub) { applySub(pub, p); });
    });
  }

  // ---------- connect / disconnect ----------

  async function connect(url, token) {
    var LK = window.LivekitClient;
    if (!LK) {
      console.error('[Voice] livekit-client UMD file is not loaded. Check your WebGL template.');
      state = STATE_FAILED;
      return;
    }

    disconnect();
    var my = ++connectToken;
    state = STATE_CONNECTING;
    ensureCtx();

    var r = new LK.Room({
      adaptiveStream: false,
      dynacast: true,
      audioCaptureDefaults: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      publishDefaults: {
        dtx: true,
        audioPreset: LK.AudioPresets ? LK.AudioPresets.speech : undefined
      }
    });

    r.on(LK.RoomEvent.TrackPublished, function (pub, p) { applySub(pub, p); });
    r.on(LK.RoomEvent.ParticipantConnected, function (p) {
      p.trackPublications.forEach(function (pub) { applySub(pub, p); });
    });
    r.on(LK.RoomEvent.TrackSubscribed, function (track, pub, p) { attach(track, p); });
    r.on(LK.RoomEvent.TrackUnsubscribed, function (track, pub, p) { detach(p.identity); });
    r.on(LK.RoomEvent.ParticipantDisconnected, function (p) { detach(p.identity); });
    r.on(LK.RoomEvent.Disconnected, function () {
      if (my !== connectToken) return;       // we disconnected on purpose
      log('disconnected by server/network');
      cleanupPeers();
      room = null;
      state = STATE_FAILED;                  // Unity retries
    });

    room = r;
    try {
      await r.connect(url, token, { autoSubscribe: false });
      if (my !== connectToken) { try { r.disconnect(); } catch (e) {} return; }
      state = STATE_CONNECTED;
      log('connected as', r.localParticipant.identity);
      applyAllSubs();
      if (desiredMic) applyMic();
    } catch (e) {
      console.error('[Voice] connect failed:', e);
      if (my === connectToken) { room = null; state = STATE_FAILED; }
    }
  }

  function disconnect() {
    connectToken++;
    if (room) { try { room.disconnect(); } catch (e) {} room = null; }
    cleanupPeers();
    micStatus = 0;
    state = STATE_IDLE;
  }

  // ---------- microphone ----------

  function setMic(on) {
    desiredMic = !!on;
    if (state === STATE_CONNECTED) applyMic();
  }

  function applyMic() {
    var want = desiredMic;
    micStatus = want ? 1 : 0;
    micChain = micChain.then(function () {
      if (!room || state !== STATE_CONNECTED) return;
      return room.localParticipant.setMicrophoneEnabled(want).then(function () {
        if (desiredMic === want) micStatus = want ? 2 : 0;
      }).catch(function (e) {
        console.warn('[Voice] microphone:', e);
        micStatus = want ? 3 : 0;
      });
    });
  }

  // ---------- called from Unity ----------

  function setSubscriptions(ids) {
    wanted = new Set(ids.map(function (x) { return String(Math.round(x)); }));
    applyAllSubs();
  }

  // arr = [slot, gain, pan, slot, gain, pan, ...]; peers not listed fade to silence
  function setPeers(arr, count) {
    if (!ctx) return;
    var t = ctx.currentTime;
    var seen = new Set();
    for (var i = 0; i < count; i++) {
      var id = String(Math.round(arr[i * 3]));
      var peer = peers.get(id);
      if (!peer) continue;
      seen.add(id);
      peer.gain.gain.setTargetAtTime(arr[i * 3 + 1], t, 0.05);
      if (peer.pan) peer.pan.pan.setTargetAtTime(arr[i * 3 + 2], t, 0.05);
    }
    peers.forEach(function (peer, id) {
      if (!seen.has(id)) peer.gain.gain.setTargetAtTime(0, t, 0.05);
    });
  }

  function setMaster(v) {
    masterVol = v;
    if (master) master.gain.value = v;
  }

  function isLocalSpeaking() {
    return room && room.localParticipant && room.localParticipant.isSpeaking ? 1 : 0;
  }

  function isSpeaking(slot) {
    if (!room) return 0;
    var p = room.remoteParticipants.get(String(slot));
    return p && p.isSpeaking ? 1 : 0;
  }

  // slots (identities) of all remote players who are talking right now
  function getSpeakers() {
    var out = [];
    if (!room) return out;
    room.remoteParticipants.forEach(function (p) {
      if (p.isSpeaking) {
        var n = Number(p.identity);
        if (!isNaN(n)) out.push(n);
      }
    });
    return out;
  }

  function getLocalLevel() {
    return room && room.localParticipant && typeof room.localParticipant.audioLevel === 'number'
      ? room.localParticipant.audioLevel : 0;
  }

  function audioSuspended() {
    return ctx && ctx.state === 'suspended' ? 1 : 0;
  }

  window.UnityVoice = {
    init: init,
    connect: connect,
    disconnect: disconnect,
    setMic: setMic,
    setSubscriptions: setSubscriptions,
    setPeers: setPeers,
    setMaster: setMaster,
    getState: function () { return state; },
    isLocalSpeaking: isLocalSpeaking,
    isSpeaking: isSpeaking,
    getSpeakers: getSpeakers,
    getMicStatus: function () { return micStatus; },
    getLocalLevel: getLocalLevel,
    audioSuspended: audioSuspended
  };
})();
