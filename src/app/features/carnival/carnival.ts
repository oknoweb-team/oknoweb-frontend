import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-carnival',
  imports: [],
  templateUrl: './carnival.html',
  styles: [`canvas { width: 100%; height: 100%; display: block; }`]
})
export class Carnival {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    const script = document.createElement('script');
    script.src = 'carnival/Build/Build0.7_Web.loader.js';
    script.onload = () => {
      (window as any).createUnityInstance(this.canvas.nativeElement, {
        dataUrl: 'carnival/Build/Build0.7_Web.data',
        frameworkUrl: 'carnival/Build/Build0.7_Web.framework.js',
        codeUrl: 'carnival/Build/Build0.7_Web.wasm',
      });
    };
    document.body.appendChild(script);
  }

  toggleFullscreen() {
      const el = this.container.nativeElement;
      if (!document.fullscreenElement) {
        el.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
}
