import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.html',
})
export class Button {
  private router = inject(Router);

  @Input('color') public color: string = '';
  @Input('preset') public preset: string = '';

  @Input('target') public target: string = '_blank';
  @Input('routeLink') public routeLink: string = '';
  @Input('link') public link: string = '';
  @Input('customProperties') public customProperties: string = '';

  @Output() onClick = new EventEmitter<MouseEvent>();

  public classes: string[] = [];

  ngOnInit() {
    let textClasses: string[] = ['text-3xl', 'md:text-4xl'];
    let widthClasses: string[] = [];
    let otherClasses: string[] = [];

    let parts: string[] = this.preset.split(' ');

    for (let part of parts) {
      switch (part) {
        case 'full':
          widthClasses = ['w-full'];
          break;

        case 'pink':
          this.color = 'bg-pink-400 hover:bg-pink-500 active:bg-pink-600 text-pink-500 text-white';
          break;

        case 'pinkalt':
          this.color = 'bg-pink-500 hover:bg-pink-400 active:bg-pink-600 text-white';
          break;

        case 'pinkalt2':
          this.color =
            'bg-white hover:bg-pink-500 text-pink-500 hover:text-white border-4 border-b-8 border-r-8 border-pink-500';
          break;

        case 'pinkalt3':
          this.color =
            'bg-pink-500 hover:bg-pink-600 text-white border-b-8 border-r-8 border-pink-500 hover:border-pink-600 transition-all duration-100 hover:scale-101';
          break;
        case 'blue':
          this.color =
            'font-bold bg-white text-blue-700 border-5 border-blue-700 hover:bg-blue-700 hover:text-white active:text-white active:bg-blue-800 active:border-blue-800';
          break;

        case 'bluealt':
          this.color = 'font-bold bg-[#000555] border-5 hover:bg-blue-400 text-white active:bg-blue-700';
          break;

        case 'bluealt2':
          this.color = 'font-bold bg-blue-600 hover:bg-blue-500 text-white active:bg-blue-700 border-2 border-blue-600 active:border-blue-700';
          break;

        case 'green':
          this.color = "font-bold bg-white hover:bg-green-500 border-4 border-green-500 text-green-500 hover:text-white"
          break;

        case 'red':
          this.color = "font-bold bg-white hover:bg-red-500 border-4 border-red-500 text-red-500 hover:text-white"
          break;

        case 'black':
          this.color = "font-bold bg-white hover:bg-black border-4 border-black text-black hover:text-white"
          break;

        case 't0':
          textClasses = ['text-sm', 'md:text-xl', '3xl:text-2xl'];
          break;

        case 't1':
          textClasses = ['text-sm', 'md:text-xl', 'xl:text-2xl', '3xl:text-4xl'];
          break;

        case 't2':
          textClasses = ['text-3xl', 'md:text-4xl', '3xl:text-6xl'];
          break;

        case 't3':
          textClasses = ['text-4xl', 'md:text-5xl', '3xl:text-6xl'];
          break;

        case 't4':
          textClasses = ['text-[38px]', 'md:text-6xl', '3xl:text-7xl'];
          break;

        case 't5':
          textClasses = ['text-5xl', 'md:text-7xl', '3xl:text-8xl'];
          break;

        case 'tvw':
          textClasses = ['text-[2vw]', 'md:text-[2vw]', '3xl:text-[2vw]'];
          break;
        case 'scale':
          otherClasses.push("transition-all duration-100 hover:scale-101")
          break;
      }
    }

    this.classes = [
      'items-center',
      'font-main',
      'h-full',
      this.color,
      ...widthClasses,
      ...textClasses,
      ...otherClasses,
      'hover:cursor-pointer',
    ];

    if (this.customProperties !== '') {
      this.classes.push(this.customProperties);
    }
  }

  openRouteLink() {
    this.router.navigate([this.routeLink]);
  }

  openLink() {
    window.open(this.link, '_blank');
  }

  handleClick(event: MouseEvent): void {
    if (this.routeLink === '' && this.link === '') {
      this.onClick.emit();
    } else if (this.routeLink !== '') {
      this.openRouteLink();
    } else if (this.link !== '') {
      this.openLink();
    }
  }
}
