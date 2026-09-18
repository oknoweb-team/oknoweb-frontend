import { Component, computed, inject, Inject, Signal } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Block } from '../../../shared/components/block/block';
import { DOCUMENT } from '@angular/common';
import { SubmitService } from '../../../core/services/submit-service';
import { TagSelector } from '../tag-selector/tag-selector';
import { toSignal } from '@angular/core/rxjs-interop';
import { SubmitPayload, TagInfo } from '../../../core/models/submit.model';
import { Button } from '../../../shared/components/button/button';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';

export const tagsResolver: ResolveFn<TagInfo[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const submitService = inject(SubmitService);
  return submitService.getTags();
};

export interface TagsRouteData
{
  tags: TagInfo[];
}

@Component({
  selector: 'app-submit',
  imports: [Button, Block, TagSelector, ReactiveFormsModule, Sidebar],
  templateUrl: './submit.html',
})
export class Submit {
  private router = inject(Router);

  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data) as Signal<TagsRouteData>;

  name = new FormControl('');
  link = new FormControl('');
  additionalInfo = new FormControl('');
  author = new FormControl('');
  tags:string[] = [];

  availableTags = computed(() => this.data().tags as TagInfo[]);

  submitAccepted: boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document, private submitService: SubmitService) {}
  ngOnInit() {
    this.document.body.classList.add('min-h-screen');
    this.document.body.classList.add('bg-[url(/background.png)]');
    this.document.body.classList.add('bg-repeat');
  }

  ngOnDestroy() {
    this.document.body.classList.remove('min-h-screen');
    this.document.body.classList.remove('bg-[url(/background.png)]');
    this.document.body.classList.remove('bg-repeat');
  }

  onTagsChanged(tags: string[]):void {
    this.tags = tags;
  }

  submit() {
    if (this.name.value != null &&
        this.link.value != null &&
        this.additionalInfo.value != null &&
        this.author.value != null) {

      let payload: SubmitPayload = {
        name : this.name.value,
        link : this.link.value,
        additionalInfo : this.additionalInfo.value,
        author: this.author.value,
        tags: this.tags
      };

      this.submitService.submitNew(payload).subscribe(response => {
        this.submitAccepted = true;
        this.router.navigate([`/submit/success/${response.id}`]);
      });
      return;
    }
  }
}
