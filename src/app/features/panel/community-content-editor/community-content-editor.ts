import { Component, computed, DOCUMENT, Inject, inject, signal } from '@angular/core';
import { PanelPage } from '../panel-page';
import { CommunityContent } from '../../../core/models/gamejams.model';
import { CommunityContentService } from '../../../core/services/community-content';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Button } from '../../../shared/components/button/button';
import { Block } from '../../../shared/components/block/block';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-community-content-editor',
  imports: [Button, Block, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './community-content-editor.html',
})
export class CommunityContentEditor extends PanelPage {
  loadingContent = computed(() => this._loadingContent);
  private _loadingContent = false;

  private _content = signal<CommunityContent[]>([]);
  readonly content = this._content.asReadonly();

  public creationMenuOpened: boolean = false;

  public label = new FormControl('');
  public author = new FormControl('');
  public description = new FormControl('');
  public link = new FormControl('');

  private readonly communityContentService = inject(CommunityContentService);

  constructor(@Inject(DOCUMENT) private document: Document) {
    super();
  }

  protected override validationPassed(): void {
    this.document.body.classList.add('min-h-screen');
    this.document.body.classList.add('bg-[url(/bg.png)]');
    this.document.body.classList.add('bg-repeat');

    this.loadContent();
  }

  ngOnDestroy() {
    this.document.body.classList.remove('min-h-screen');
    this.document.body.classList.remove('bg-[url(/bg.png)]');
    this.document.body.classList.remove('bg-repeat');
  }

  public loadContent() {
    this.communityContentService.getCommunityContent().subscribe((content) => {
      this._content.set(content);
      this._loadingContent = false;
    });
  }

  public delete(id: string) {
    this.panelService.deleteCommunityContent(id).subscribe(r => this.loadContent());
  }

  public openMenu() {
    this.creationMenuOpened = true;

    this.label.setValue('');
    this.author.setValue('');
    this.description.setValue('');
    this.link.setValue('');
  }

  public closeMenu() {
    this.creationMenuOpened = false;

    this.label.setValue('');
    this.author.setValue('');
    this.description.setValue('');
    this.link.setValue('');
  }

  public post() {
    if (
      this.link.value != null &&
      this.label.value != null &&
      this.author.value != null &&
      this.description.value != null
    ) {

      this.panelService
        .postCommunityContent({
          label: this.label.value,
          author: this.author.value,
          link: this.link.value,
          description: this.description.value
        })
        .subscribe((r) => this.loadContent());
      this.closeMenu();
    }
  }
}
