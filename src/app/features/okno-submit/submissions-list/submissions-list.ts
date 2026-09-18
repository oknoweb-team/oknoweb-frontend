import {
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  type Signal,
  type SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../shared/components/button/button';
import { SubmitInfo } from '../../../core/models/submit.model';
import { SubmitCard } from '../submit-card/submit-card';
import { TagSelector } from '../tag-selector/tag-selector';
import { Block } from '../../../shared/components/block/block';
export enum SortingType {
  OldNew,
  NewOld,
}

export enum ShowcaseSize {
  Less,
  More,
  All,
}

@Component({
  imports: [Block, Button, SubmitCard, FormsModule, TagSelector],
  selector: 'app-submissions-list',
  templateUrl: './submissions-list.html',
})
export class SubmissionsList {
  @Output() showcaseChanged = new EventEmitter<SubmitInfo[]>();
  @Input() submissions: SubmitInfo[] = [];

  public filteredSubmissions: SubmitInfo[] = this.submissions;
  public listSignal = computed(() => this.filteredSubmissions);

  public sortText: string = 'notinit';
  public currentShowcaseSize: number = 0;
  public currentTab: number = 1;
  public tabsCount: number = 1;
  public showcaseSizeText: string = 'notinit';

  private currentSorting: SortingType = SortingType.NewOld;

  private selectedTags: string[] = [];
  private currentShowcaseSizeSwitcher: ShowcaseSize = ShowcaseSize.Less;

  private filterText: string = '';

  ngOnInit() {
    this.filteredSubmissions = this.submissions;
    this.applySort(SortingType.NewOld);

    this.applyShowcaseSize(ShowcaseSize.Less);
    this.filter();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.filter();
    this.applySort(this.currentSorting)
  }

  public setFilterText(filter: string) {
    this.filterText = filter;
    this.filter();
  }

  public filter() {
    this.filteredSubmissions = this.submissions.filter(
      (item) =>
        (item.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
          this.filterText === '') &&
        (this.selectedTags.length == 0 || this.hasSelectedTags(item)),
    );

    this.applyShowcaseSize(this.currentShowcaseSizeSwitcher);
    this.updateShowcase();
  }

  private updateShowcase() {
    let i = 0;
    let test: SubmitInfo[] = [];
    for (const item of this.filteredSubmissions) {
      if (
        i >= (this.currentTab - 1) * this.currentShowcaseSize &&
        i < this.currentTab * this.currentShowcaseSize
      ) {
        test.push(item);
      }
      i++;
    }
    this.showcaseChanged.emit(test);
  }

  public selectedTagsChanged(tags: string[]) {
    this.selectedTags = tags;
    this.filter();
  }

  private hasSelectedTags(submit: SubmitInfo): boolean {
    let counter = 0;
    for (const tag of this.selectedTags) {
      if (submit.tags != null && submit.tags.includes(tag)) {
        counter++;
      }
    }

    return counter == this.selectedTags.length;
  }

  public switchSortingType() {
    let switchedSorting: number = this.currentSorting;
    switchedSorting++;

    if (!(switchedSorting in SortingType)) {
      switchedSorting = 0;
    }

    this.applySort(switchedSorting);
  }

  public applySort(type: SortingType) {
    this.currentSorting = type;

    this.filteredSubmissions.sort((a, b) => {
      const [d1, m1, y1] = a.date.split('/').map(Number);
      const [d2, m2, y2] = b.date.split('/').map(Number);

      if (this.currentSorting === SortingType.OldNew) {
        return new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime();
      } else {
        return new Date(y2, m2 - 1, d2).getTime() - new Date(y1, m1 - 1, d1).getTime();
      }
    });

    if (this.currentSorting === SortingType.OldNew) {
      this.sortText = 'nf-md-sort_ascending';
    } else {
      this.sortText = 'nf-md-sort_descending';
    }
  }

  public switchShowcaseSize() {
    let showcaseSize: number = this.currentShowcaseSizeSwitcher;
    showcaseSize++;

    if (!(showcaseSize in ShowcaseSize)) {
      showcaseSize = 0;
    }

    this.applyShowcaseSize(showcaseSize);
  }

  public getShowcaseSize(size: ShowcaseSize): number {
    switch (size) {
      case ShowcaseSize.Less: {
        return 5;
      }

      case ShowcaseSize.More: {
        return 10;
      }

      case ShowcaseSize.All: {
        return this.submissions.length;
      }
    }
  }

  public applyShowcaseSize(size: ShowcaseSize) {
    this.currentShowcaseSizeSwitcher = size;
    this.currentTab = 1;

    switch (this.currentShowcaseSizeSwitcher) {
      case ShowcaseSize.Less: {
        this.showcaseSizeText = '5 игр';
        this.tabsCount = Math.ceil(this.filteredSubmissions.length / 5);
        break;
      }

      case ShowcaseSize.More: {
        this.showcaseSizeText = '10 игр';
        this.tabsCount = Math.ceil(this.filteredSubmissions.length / 10);
        break;
      }

      case ShowcaseSize.All: {
        this.showcaseSizeText = 'все';
        this.tabsCount = 1;
        break;
      }
    }

    if (this.tabsCount === 0) {
      this.tabsCount = 1;
    }

    this.currentShowcaseSize = this.getShowcaseSize(size);
  }

  public moveNextTab() {
    this.currentTab++;

    if (this.currentTab > this.tabsCount) {
      this.currentTab = 1;
    }
    this.scrollToTop();
    this.updateShowcase();
  }

  public moveBackTab() {
    this.currentTab--;

    if (this.currentTab <= 0) {
      this.currentTab = this.tabsCount;
    }
    this.scrollToTop();
    this.updateShowcase();
  }

  private scrollToTop() {
    const element = document.getElementById('top');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
