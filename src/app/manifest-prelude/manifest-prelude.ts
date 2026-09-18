import { Component, DOCUMENT, Inject } from '@angular/core';
import { Block } from '../shared/components/block/block';
import { RouterLink } from '@angular/router';
import { Sidebar } from '../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-manifest-prelude',
  imports: [ Block, RouterLink, Sidebar],
  templateUrl: './manifest-prelude.html',
})
export class ManifestPrelude {
  navigation:[string, string][] = [ ["ПРЕЛЮДИЯ", "prelude"], ["МАНИФЕСТ", "manifest"] ]

  constructor(@Inject(DOCUMENT) private document: Document) {}
  ngOnInit() {
    this.document.body.classList.add('min-h-screen');
    this.document.body.classList.add('bg-[url(/bgmeltedpink.png)]');
    this.document.body.classList.add('bg-repeat');
  }
  ngOnDestroy() {
    this.document.body.classList.remove('min-h-screen');
    this.document.body.classList.remove('bg-[url(/bgmeltedpink.png)]');
    this.document.body.classList.remove('bg-repeat');
  }
}
