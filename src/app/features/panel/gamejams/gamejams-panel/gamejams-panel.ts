import { Component, computed, DOCUMENT, Inject, inject, signal } from '@angular/core';
import { GameJam } from '../../../../core/models/gamejams.model';
import { GameJamsService } from '../../../../core/services/gamejams-service';
import { Block } from '../../../../shared/components/block/block';
import { GamejamPanel } from '../gamejam-panel/gamejam-panel';
import { GamejamCreatorPanel } from '../gamejam-creator-panel/gamejam-creator-panel';
import { PanelPage } from '../../panel-page';

@Component({
  selector: 'app-gamejams-panel',
  imports: [Block, GamejamPanel, GamejamCreatorPanel],
  templateUrl: './gamejams-panel.html',
})
export class GamejamsPanel extends PanelPage {
  loadingContent = computed(() => this._loagingContent);
  private _loagingContent = false;

  private _gamejams = signal<GameJam[]>([]);
  readonly gamejams = this._gamejams.asReadonly();

  private readonly gamejamsService = inject(GameJamsService);

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
    this.gamejamsService.getGameJams().subscribe(jams => {
      this._gamejams.set(jams);
      this._loagingContent = false;
    });
  };
}
