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

  constructor(private zone: NgZone) { }

  ngAfterViewInit() {
    const script = document.createElement('script');
    script.src = 'https://oknocarnival.ru/webgl/carnival-main.js';
    script.onload = () => {
      (window as any).loadCarnival(this.canvas.nativeElement, "https://oknocarnival.ru/webgl", {
        onProgress: (progress: number) => {
          this.zone.run(() => this.progress.set(progress))
        },
        onSuccess: (instance: any) => {
          console.log("CARNIVAL LOADED")
        },
        onError: (message: string) => {
          alert(message)
        }
      });
    };
    document.body.appendChild(script);
  }

  toggleFullscreen() {
    const el = this.container.nativeElement;
    document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen();
  }
}
