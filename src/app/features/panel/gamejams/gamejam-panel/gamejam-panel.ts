import { Component, inject, Input, signal } from '@angular/core';
import { GameJam } from '../../../../core/models/gamejams.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Button } from '../../../../shared/components/button/button';
import { PanelService } from '../../../../core/services/panel-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gamejam-panel',
  imports: [Button, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './gamejam-panel.html',
})
export class GamejamPanel {
  @Input("gamejam") gamejam!: GameJam;

  public editorOpened = signal(false);
  public contentForm = new FormControl('');

  private panelService = inject(PanelService);

  public openContentEditor()
  {
    this.editorOpened.set(true);

    let ids = "";

    for (let i = 0; i < this.gamejam.content.length; i++) {
      ids += this.gamejam.content[i].id + " "
    }

    this.contentForm.setValue(ids);
  }

  public closeContentEditor()
  {
    this.editorOpened.set(false);
  }

  public updateContent()
  {
    this.panelService.postGameJamContent(this.gamejam.id, this.contentForm.value!.split(' ')).subscribe(r => this.closeContentEditor())
  }
}
