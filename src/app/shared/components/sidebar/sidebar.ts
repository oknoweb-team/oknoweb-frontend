import { NgClass, NgTemplateOutlet } from '@angular/common';
import { afterNextRender, Component, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../button/button';

@Component({
  selector: 'app-sidebar',
  imports: [Button, RouterLink, NgTemplateOutlet, NgClass],
  templateUrl: './sidebar.html',
  styles: [`
        .runningLine {
          animation: scrollUp 20s linear infinite;
        }
        @keyframes scrollUp {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-100%); }
        }
      `]
})
export class Sidebar {
  @Input("navigation") public navigation!: [string, string][];

  public isHorizontal = signal(true);
  public isExpanded = signal(false);
  public width = signal(20);

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
    if (this.isExpanded()) {
      this.width.set(50);
    }
    else {
      this.width.set(20);
    }

  }

  scrollToSection(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
