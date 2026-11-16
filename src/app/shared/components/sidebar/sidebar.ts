import { isPlatformBrowser, NgClass, NgTemplateOutlet } from '@angular/common';
import { afterNextRender, ChangeDetectorRef, Component, ElementRef, Inject, Input, PLATFORM_ID, signal } from '@angular/core';
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

  public activeId = signal("");

  private observer!: IntersectionObserver;
  private intersecting = new Set<HTMLElement>();

  constructor(
    private elRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    afterNextRender(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.isHorizontal.set(width > height);
      this.isExpanded.set(this.isHorizontal());
    });
  }


  ngAfterContentInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          for (const entry of entries) {
            const el = entry.target as HTMLElement;
            if (entry.isIntersecting) this.intersecting.add(el);
            else this.intersecting.delete(el);
          }
                  this.evaluate();
        });
      },
      {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    setTimeout(() => {
      const projectedElements = this.elRef.nativeElement.querySelectorAll('[id]');
      projectedElements.forEach((el) => this.observer?.observe(el));
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
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

  private evaluate(): void {
     const viewportCenter = window.innerHeight / 2;

     let bestId: string | null = null;
     let bestDist = Infinity;

     this.intersecting.forEach((el) => {
       const rect = el.getBoundingClientRect();
       const elCenter = rect.top + rect.height / 2;
       const dist = Math.abs(elCenter - viewportCenter);

       if (dist < bestDist) {
         bestDist = dist;
         bestId = el.id;
       }
     });

     if (bestId !== this.activeId && bestId != null && this.navigation.some(x => x[1] == bestId)) {
       this.activeId.set(bestId);
     }
   }
}
