import type { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Submissions } from './features/okno-submit/submissions/submissions'
import { Submit, tagsResolver } from './features/okno-submit/submit/submit';
import { SubmitSuccess } from './features/okno-submit/submit-success/submit-success';
import { SubmissionPage } from './features/okno-submit/submission-page/submission-page';
import { PanelLogin } from './features/panel/panel-login/panel-login';
import { PanelRoot } from './features/panel/panel-root/panel-root';
import { PanelSubmit } from './features/panel/submit/panel-submit/panel-submit';
import { PanelSubmitTags } from './features/panel/submit/panel-submit-tags/panel-submit-tags';
import { Manifest } from './manifest/manifest';
import { ManifestPrelude } from './manifest-prelude/manifest-prelude';
import { GamejamsPanel } from './features/panel/gamejams/gamejams-panel/gamejams-panel';
import { GamejamsPage } from './features/gamejams-page/gamejams-page';
import { CommunityContentEditor } from './features/panel/community-content-editor/community-content-editor';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: Home },
  { path: 'manifest-prelude', component: ManifestPrelude },
  { path: 'manifest', component: Manifest },
  {
    path: 'submit',
    component: Submit,
    resolve: {
      tags: tagsResolver
    },
  },
  {
    path: 'submissions',
    component: Submissions,
  },
  {
    path: 'submissions/:id',
    component: SubmissionPage,
  },
  {
    path: 'submit/success/:id',
    component: SubmitSuccess,
  },
  {
    path: 'gamejams',
    component: GamejamsPage,
  },
  {
    path: 'panel',
    component: PanelRoot,
  },
  {
    path: 'panel/login',
    component: PanelLogin,
  },
  {
    path: 'panel/submit',
    component: PanelSubmit,
  },
  {
    path: 'panel/gamejams',
    component: GamejamsPanel,
  },
  {
    path: 'panel/community-content',
    component: CommunityContentEditor,
  },
  {
    path: 'panel/submit/tags',
    component: PanelSubmitTags,
  },
];
