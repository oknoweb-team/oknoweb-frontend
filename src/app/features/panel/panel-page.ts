import { Router } from "@angular/router";
import { PanelService } from "../../core/services/panel-service";
import { Directive, DOCUMENT, Inject, inject } from "@angular/core";

@Directive()
export abstract class PanelPage {
  protected router = inject(Router);
  protected panelService = inject(PanelService);

  protected abstract validationPassed(): void;

  ngOnInit()
  {
    this.panelService.validateLogin().subscribe({
      next: () => {
        this.validationPassed();
      },
      error: () => {
        this.router.navigate(['/panel/login']);
      }
    });
  }
}
