import { Component, inject, Inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { SubmitService } from '../../../core/services/submit-service';
import { SubmitInfo } from '../../../core/models/submit.model';
import { Block } from '../../../shared/components/block/block';
import { Button } from '../../../shared/components/button/button';
import { Submission } from '../submission/submission';

@Component({
  selector: 'app-submission-page',
  imports: [Block, Button, Submission],
  templateUrl: './submission-page.html',
})
export class SubmissionPage {
  private _submission = signal<SubmitInfo | null>(null);
  public submission = this._submission.asReadonly();

  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _submitService = inject(SubmitService);

  openReview() {}

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    this._route.params.subscribe((params) => {
      const providedID: string = params['id'];
      const id = providedID;

      this._submitService.getSubmission(id).subscribe({
        next: (submission) => {
          this._submission.set(submission);

          this.document.body.classList.add('min-h-screen');
          this.document.body.classList.add('bg-[url(/bg.png)]');
          this.document.body.classList.add('bg-repeat');
        },
        error: (e) => {
          this._router.navigate(["home"])
        }
      });
    });
  }

  ngOnDestroy() {
    this.document.body.classList.remove('min-h-screen');
    this.document.body.classList.remove('bg-[url(/bg.png)]');
    this.document.body.classList.remove('bg-repeat');
  }
}
