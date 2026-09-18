import { Component, Inject, inject, signal } from '@angular/core';
import { Button } from '../../shared/components/button/button';
import { Block } from '../../shared/components/block/block';
import { DOCUMENT } from '@angular/common';
import { SubmitService } from '../../core/services/submit-service';
import { SubmitInfo } from '../../core/models/submit.model';
import { SubmissionsLine } from '../okno-submit/submissions-line/submissions-line';
import { Sidebar } from '../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-home',
  imports: [Button, Block, SubmissionsLine, Sidebar],
  templateUrl: './home.html',
  styles: [],
})
export class Home {
  navigation : [string, string][] = [ ["ОБ OKNO", "about"], ["ССЫЛКИ", "links"], ["САБМИТ", "submit"], ["ДЖЕМЫ", "jams"], ["ДОНАТ", "donation"], ["КОНТРИБЬЮЕТРАМ", "contribute"] ]
  submissionsLine = signal<SubmitInfo[]>([]);

  private submitService = inject(SubmitService);

  constructor(@Inject(DOCUMENT) private document: Document) {}
  ngOnInit() {
    this.document.body.classList.add('min-h-screen');
    this.document.body.classList.add('bg-[url(/bg.png)]');
    this.document.body.classList.add('bg-repeat');

    this.submitService.getSubmissions().subscribe(subs => {
      const sorted = [...subs].sort((a, b) => {
        const [d1, m1, y1] = a.date.split('/').map(Number);
        const [d2, m2, y2] = b.date.split('/').map(Number);
        return new Date(y2, m2 - 1, d2).getTime() - new Date(y1, m1 - 1, d1).getTime();
      });

      this.submissionsLine.set(sorted.slice(0, 20));
    });
  }

  ngOnDestroy() {
    this.document.body.classList.remove('min-h-screen');
    this.document.body.classList.remove('bg-[url(/bg.png)]');
    this.document.body.classList.remove('bg-repeat');
  }
}
