import { DecimalPipe } from '@angular/common';
import { Block } from '../../shared/components/block/block';
import {
  Component,
  ElementRef,
  ViewChild,
  NgZone,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-carnival',
  standalone: true,
  imports: [DecimalPipe, Block],
  templateUrl: './carnival.html',
  styles: [`canvas { width: 100%; height: 100%; display: block; object-fit:contain; }`],
  host: {
    class: 'block w-full h-full',
  },
})
export class Carnival {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;

  progress = signal(0);
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
        (p: number) => this.zone.run(() => this.progress.set(p))
      );
    };
    document.body.appendChild(script);
  }

  toggleFullscreen() {
    const el = this.container.nativeElement;
    document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen();
  }
}
