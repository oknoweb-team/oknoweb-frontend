import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Block } from '../../../shared/components/block/block';
import type { SubmitInfo } from '../../../core/models/submit.model';
import { SubmissionsList } from '../submissions-list/submissions-list';
import { SubmitService } from '../../../core/services/submit-service';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';

export enum SortingType {
  OldNew,
  NewOld,
}

@Component({
  imports: [FormsModule, SubmissionsList, Block, RouterModule, CommonModule, Sidebar],
  selector: 'app-submissions',
  templateUrl: './submissions.html',
})
export class Submissions {
  private _navigation = signal<[string,string][]>([]);
  readonly navigation = this._navigation.asReadonly();

  private _submissions = signal<SubmitInfo[]>([]);
  readonly submissions = this._submissions.asReadonly();

  public pending: boolean = true;

  private submitService = inject(SubmitService);

  openPending() {
    this.pending = true;
  }
  openReviewed() {
    this.pending = false;
  }

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    this.document.body.classList.add('min-h-screen');
    this.document.body.classList.add('bg-[url(/bgmelted.png)]');
    this.document.body.classList.add('bg-repeat');

    this.submitService.getSubmissions().subscribe((s) => this._submissions.set(s));
  }

  ngOnDestroy() {
    this.document.body.classList.remove('min-h-screen');
    this.document.body.classList.remove('bg-[url(/bgmelted.png)]');
    this.document.body.classList.remove('bg-repeat');
  }

  public updateNavigation(submissions: SubmitInfo[]) {
    let navigation:[string,string][] = []
    for (const submission of submissions) {
      navigation.push([submission.name, submission.id]);
    }
    this._navigation.set(navigation)
  }
}
