import { Component, computed, DOCUMENT, Inject, inject, Signal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PanelSubmitCard } from '../panel-submit-card/panel-submit-card';
import { Button } from '../../../../shared/components/button/button';
import { Block } from '../../../../shared/components/block/block';
import { PrivateSubmitInfo } from '../../../../core/models/submit.model';
import { PanelPage } from '../../panel-page';

@Component({
  selector: 'app-panel-submit',
  imports: [Block, Button, CommonModule, FormsModule, PanelSubmitCard],
  templateUrl: './panel-submit.html',
})
export class PanelSubmit extends PanelPage {
  private _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private _showVerified = signal(false);
  readonly showVerified = this._showVerified.asReadonly();

  error = computed(() => this._error);

  selectedSubmissions = computed(() =>
  {
    if (this.showVerified()) return this.verifiedSubmissions();
    return this.unverifiedSubmissions();
  })

  private _verified = signal<PrivateSubmitInfo[]>([]);
  readonly verifiedSubmissions = this._verified.asReadonly();

  private _unverified = signal<PrivateSubmitInfo[]>([]);
  readonly unverifiedSubmissions = this._unverified.asReadonly();

  private _error: string | null = null;

  private route = inject(ActivatedRoute);

  constructor(@Inject(DOCUMENT) private document: Document) {
    super();
    this._showVerified.set(this.route.snapshot.queryParamMap.keys.includes("verified"));
  }

  protected override validationPassed(): void {
    this.document.body.classList.add('min-h-screen');
    this.document.body.classList.add('bg-[url(/bg.png)]');
    this.document.body.classList.add('bg-repeat');

    this.loadSubmissions();
  }

  ngOnDestroy() {
    this.document.body.classList.remove('min-h-screen');
    this.document.body.classList.remove('bg-[url(/bg.png)]');
    this.document.body.classList.remove('bg-repeat');
  }

  openPending() {
    this._showVerified.set(false);
    this.updateUrl();
  }

  openVerified() {
    this._showVerified.set(true);
    this.updateUrl();
  }

  loadSubmissions() {
    this._loading.set(true);
    this.panelService.getSubmissions()
      .then(r => { if (!r.ok) throw new Error(r.status + ''); return r.json(); })
      .then((data: PrivateSubmitInfo[]) => {
        this._unverified.set(data.filter(s => s.status === 'unverified'));
        this._verified.set(data.filter(s => s.status !== 'unverified'));
        this._loading.set(false);
      })
      .catch(e => {
        this._error = 'Ошибка загрузки заявок (' + e.message + ')';
        this._loading.set(false);
      });
  }

  private updateUrl() {
    this.router.navigate([], {
      queryParams: this._showVerified() ? {"verified": ""} : {},
      queryParamsHandling: "replace"
    })
  }
}
