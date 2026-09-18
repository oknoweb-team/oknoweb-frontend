import { Component, computed, inject, signal } from '@angular/core';
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

  protected override validationPassed(): void {
    this.loadContent();
  }

  public loadContent() {
    this.gamejamsService.getGameJams().subscribe(jams => {
      this._gamejams.set(jams);
      this._loagingContent = false;
    });
  };
}
