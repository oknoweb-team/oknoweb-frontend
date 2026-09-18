import { Component, DOCUMENT, Inject, inject, signal } from '@angular/core';
import { GameJamsService } from '../../core/services/gamejams-service';
import { GameJam } from '../../core/models/gamejams.model';
import { Block } from '../../shared/components/block/block';
import { Button } from '../../shared/components/button/button';
import { Sidebar } from '../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-gamejams-page',
  imports: [Block, Button, Sidebar],
  templateUrl: './gamejams-page.html',
})
export class GamejamsPage {
  public isLoading: boolean = false;

  private _gamejams = signal<GameJam[]>([]);
  public readonly gamejams = this._gamejams.asReadonly();

  private _navigation = signal<[string, string][]>([]);
  public readonly navigation = this._navigation.asReadonly();

  private readonly gamejamsService = inject(GameJamsService);

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    this.document.body.classList.add('min-h-screen');
    this.document.body.classList.add('bg-[url(/bg.png)]');
    this.document.body.classList.add('bg-repeat');

    this.isLoading = true;
    this.gamejamsService.getGameJams().subscribe(jams => {
      jams.reverse()
      this._gamejams.set(jams);

      let nav: [string, string][] = []
      for (const jam of jams) {
        nav.push([jam.title, jam.id])
      }
      this._navigation.set(nav)
      this.isLoading = false;
    })
  }

  ngOnDestroy() {
    this.document.body.classList.remove('min-h-screen');
    this.document.body.classList.remove('bg-[url(/bg.png)]');
    this.document.body.classList.remove('bg-repeat');
  }
}
