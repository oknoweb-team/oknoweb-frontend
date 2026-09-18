import { Component, inject, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Block } from '../../../shared/components/block/block';
import { Button } from '../../../shared/components/button/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { PanelService } from '../../../core/services/panel-service';

@Component({
  selector: 'app-panel-login',
  imports: [Block, Button, FormsModule, CommonModule],
  templateUrl: './panel-login.html',
})
export class PanelLogin {
  username: string = '';
  password: string = '';
  loginFailed: boolean = false;

  private router = inject(Router);
  private panelService = inject(PanelService);

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    this.document.body.classList.add('min-h-screen');
    this.document.body.classList.add('bg-[url(/bg.png)]');
    this.document.body.classList.add('bg-repeat');
  }
  ngOnDestroy() {
    this.document.body.classList.remove('min-h-screen');
    this.document.body.classList.remove('bg-[url(/bg.png)]');
    this.document.body.classList.remove('bg-repeat');
  }

  login() {
    this.panelService.validateUser(this.username, this.password).subscribe({
      next: () => {
        localStorage.setItem('admin-logged', 'true');
        localStorage.setItem('admin_username', this.username);
        localStorage.setItem('admin_password', this.password);

        this.router.navigate(['/panel']);
      },
      error: () => {
        this.loginFailed = true;
      }
    });
  }

}
