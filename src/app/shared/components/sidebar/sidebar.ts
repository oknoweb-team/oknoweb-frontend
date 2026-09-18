import { NgTemplateOutlet } from '@angular/common';
import { afterNextRender, Component, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  @Input("navigation") public navigation!: [string, string][];

  public isHorizontal = signal(true);
  public isExpanded = signal(false);

  constructor() {
    afterNextRender(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.isHorizontal.set(width > height);
      this.isExpanded.set(this.isHorizontal());
    });
  }

  expand()
  {
    this.isExpanded.set(!this.isExpanded());
  }

  scrollToSection(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
