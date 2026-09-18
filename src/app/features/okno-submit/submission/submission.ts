import { afterNextRender, Component, inject, Input, signal } from '@angular/core';
import { SubmitInfo } from '../../../core/models/submit.model';
import { SubmissionReviews } from '../submission-reviews/submission-reviews';
import { SubmitService } from '../../../core/services/submit-service';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-submission',
  imports: [SubmissionReviews],
  templateUrl: './submission.html',
})
export class Submission
{
  @Input("submission") submission!: SubmitInfo;
  public coverUrl = signal<string | null>(null)
  public isHorizontal = signal(true);
  public horizontalObservable = toObservable(this.isHorizontal);

  private submitService = inject(SubmitService);

  constructor() {
    afterNextRender(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.isHorizontal.set(width > height);
      this.horizontalObservable.subscribe(() => {
        if (this.isHorizontal())
        {
          this.submitService.getSubmissionHorizontalCover(this.submission.id).subscribe((b) => this.coverUrl.set(URL.createObjectURL(b)));
        }
        else
        {
          this.submitService.getSubmissionVerticalCover(this.submission.id).subscribe((b) => this.coverUrl.set(URL.createObjectURL(b)));
        }
      })
    });
  }
}
