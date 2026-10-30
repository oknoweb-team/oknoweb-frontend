import { DecimalPipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-carnival',
  imports: [DecimalPipe],
  templateUrl: './carnival.html',
  styles: [`canvas { width: 100%; height: 100%; display: block; }`]
})
export class Carnival {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;

  progress = 0;
  isFullscreen = false;

  ngAfterViewInit() {
    const script = document.createElement('script');
    script.src = 'carnival/Build/Build0.7_Web.loader.js';
    script.onload = () => {
      (window as any).createUnityInstance(
        this.canvas.nativeElement, {
          dataUrl: 'carnival/Build/Build0.7_Web.data',
          frameworkUrl: 'carnival/Build/Build0.7_Web.framework.js',
          codeUrl: 'carnival/Build/Build0.7_Web.wasm',
        },
        (p: number) => (this.progress = p)
      );
    };
    document.body.appendChild(script);
  }

  toggleFullscreen() {
    const el = this.container.nativeElement;
    document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen();
  }
}
