import { Component, inject, Input, OnDestroy, signal } from '@angular/core';
import { SubmitInfo } from '../../../core/models/submit.model';
import { RouterLink } from '@angular/router';
import { SubmitService } from '../../../core/services/submit-service';

interface PreviewState {
  submission: SubmitInfo;
  left: number;
  top: number;
  width: number;
  maxHeight: number;
  above: boolean;
}

@Component({
  selector: 'app-submissions-line',
  imports: [RouterLink],
  templateUrl: './submissions-line.html',
  styles: [`
        .marquee-content {
          animation: marquee 30s linear infinite;
        }
        .marquee-paused {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .preview-popup {
          animation: preview-in 120ms ease-out;
        }
        @keyframes preview-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `]
})
export class SubmissionsLine implements OnDestroy {
  @Input("submissions") submissions!: SubmitInfo[];
  marqueePaused = false;

  public preview = signal<PreviewState | null>(null);
  public cover = signal<string | null | undefined>(undefined);

  private submitService = inject(SubmitService);

  private covers = new Map<string, string | null>();
  private loading = new Set<string>();
  private hideTimer?: ReturnType<typeof setTimeout>;

  private readonly popupWidth = 620;
  private readonly popupGap = 12;
  private readonly popupHeight = 240;

  public showPreview(submission: SubmitInfo, event: MouseEvent): void {
    this.cancelHide();

    const anchor = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const width = Math.min(this.popupWidth, window.innerWidth - 16);
    const spaceAbove = anchor.top - this.popupGap - 8;
    const spaceBelow = window.innerHeight - anchor.bottom - this.popupGap - 8;
    const above = spaceAbove >= this.popupHeight || spaceAbove >= spaceBelow;

    this.preview.set({
      submission,
      width,
      above,
      left: Math.min(
        Math.max(8, anchor.left + anchor.width / 2 - width / 2),
        window.innerWidth - width - 8,
      ),
      top: above ? anchor.top - this.popupGap : anchor.bottom + this.popupGap,
      maxHeight: Math.max(80, above ? spaceAbove : spaceBelow),
    });

    this.cover.set(this.covers.get(submission.id));

    if (!this.covers.has(submission.id)) {
      this.loadCover(submission.id);
    }
  }

  public scheduleHide(): void {
    this.cancelHide();
    this.hideTimer = setTimeout(() => this.preview.set(null), 140);
  }

  public ngOnDestroy(): void {
    this.cancelHide();
    this.covers.forEach((url) => url && URL.revokeObjectURL(url));
  }

  private loadCover(id: string): void {
    if (this.loading.has(id)) {
      return;
    }
    this.loading.add(id);

    this.submitService.getSubmissionHorizontalCover(id).subscribe({
      next: (blob) => this.saveCover(id, URL.createObjectURL(blob)),
      error: () => this.saveCover(id, null),
    });
  }

  private saveCover(id: string, url: string | null): void {
    this.loading.delete(id);
    this.covers.set(id, url);

    if (this.preview()?.submission.id === id) {
      this.cover.set(url);
    }
  }

  private cancelHide(): void {
    clearTimeout(this.hideTimer);
    this.hideTimer = undefined;
  }
}
