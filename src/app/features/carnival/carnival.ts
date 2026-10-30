import { DecimalPipe } from '@angular/common';
import { NgZone } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Block } from '../../shared/components/block/block';

@Component({
  selector: 'app-carnival',
  imports: [DecimalPipe, Block],
  templateUrl: './carnival.html',
  styles: [`canvas { width: 100%; height: 100%; display: block; }`]
})
export class Carnival {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;

  progress = 0;
  isFullscreen = false;

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    const script = document.createElement('script');
    script.src = 'carnival/Build/Build0.8_Web.loader.js';
    script.onload = () => {
      (window as any).createUnityInstance(
        this.canvas.nativeElement, {
          dataUrl:      'carnival/Build/Build0.8_Web.data',
          frameworkUrl: 'carnival/Build/Build0.8_Web.framework.js',
          codeUrl:      'carnival/Build/Build0.8_Web.wasm',
        },
        (p: number) => this.zone.run(() => this.progress = p)
      );
    };
    document.body.appendChild(script);
  }

  toggleFullscreen() {
    const el = this.container.nativeElement;
    document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen();
  }
}
