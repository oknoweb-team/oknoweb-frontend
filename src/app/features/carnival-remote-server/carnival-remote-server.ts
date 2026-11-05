import { Component, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SafePipe } from '../../core/pipes/safe-pipe';

@Component({
  selector: 'app-carnival-remote-server',
  imports: [SafePipe],
  templateUrl: './carnival-remote-server.html',
})
export class CarnivalRemoteServer {
  isLoading = signal(true);
  gameUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.gameUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://oknocarnival.ru/webgl");
  }

  onLoaded()
  {
    this.isLoading.set(false);
  }
}
