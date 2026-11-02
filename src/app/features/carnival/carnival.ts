import { DecimalPipe } from '@angular/common';
import { Block } from '../../shared/components/block/block';
import {
  Component,
  ElementRef,
  ViewChild,
  NgZone,
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

  async ngAfterViewInit() {
    await this.loadScript('assets/unity-voice.js');
    const script = document.createElement('script');
    script.src = 'assets/Build/Build1.0_Web.loader.js';
    script.onload = () => {
      (window as any).createUnityInstance(
        this.canvas.nativeElement, {
          dataUrl:      'assets/Build/Build1.0_Web.data',
          frameworkUrl: 'assets/Build/Build1.0_Web.framework.js',
          codeUrl:      'assets/Build/Build1.0_Web.wasm',
        },
        (p: number) => this.zone.run(() => this.progress.set(p))
      );
    };
    document.body.appendChild(script);
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false; // Ensure sequential execution
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.body.appendChild(script);
    });
  }

  toggleFullscreen() {
    const el = this.container.nativeElement;
    document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen();
  }
}
