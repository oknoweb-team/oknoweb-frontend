import { Component, DOCUMENT, Inject } from '@angular/core';
import { Block } from '../shared/components/block/block';
import { RouterLink } from '@angular/router';
import { Sidebar } from '../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-manifest',
  imports: [Block, RouterLink, Sidebar],
  templateUrl: './manifest.html',
})
export class Manifest {
  public navigation: [string, string][] = [
    ["ПРОБЛЕМЫ", "problems"],
    ["РЕШЕНИЯ", "solutions"],
    ["ДЕЙСТВИЯ", "actions"],
    ["ПРОЕКТЫ", "projects"],
    ["ЦЕЛИ", "goals"],
  ]

  constructor(@Inject(DOCUMENT) private document: Document) { }
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
