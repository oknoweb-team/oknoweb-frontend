import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PanelService } from '../../../../core/services/panel-service';
import { Button } from '../../../../shared/components/button/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gamejam-creator-panel',
  imports: [Button, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './gamejam-creator-panel.html',
})
export class GamejamCreatorPanel {
  @Output() created = new EventEmitter<void>();

  public creationMenuOpened = false;

  public link = new FormControl('');
  public startDate = new FormControl('');
  public endDate = new FormControl('');
  public content = new FormControl('');

  private panelService = inject(PanelService);

  public openMenu()
  {
    this.creationMenuOpened = true;

    this.link.setValue("");
    this.startDate.setValue("");
    this.endDate.setValue("");
    this.content.setValue("");
  }

  public closeMenu()
  {
    this.creationMenuOpened = false;

    this.link.setValue("");
    this.startDate.setValue("");
    this.endDate.setValue("");
    this.content.setValue("");
  }

  public post()
  {
    if (this.link.value != null && this.startDate.value != null && this.endDate.value != null && this.content.value != null)
    {
      let contentArray = this.content.value.split(' ');
      if (contentArray == null) {
        contentArray = [];
      }

      this.panelService.postGameJam({ link: this.link.value, startDate: this.startDate.value, endDate: this.endDate.value, content: contentArray }).subscribe(r => this.created.emit());
      this.closeMenu();
    }
  }
}
