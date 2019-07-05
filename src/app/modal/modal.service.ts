
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {

  /**
   * On close event handler
   */
  onClose: Subject<boolean> = new Subject();

  constructor(private overlay: Overlay) { }

  getOverlayConfig(): OverlayConfig {
    const config = new OverlayConfig({
        positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
        scrollStrategy: this.overlay.scrollStrategies.block(),
        hasBackdrop: true
    });

    return config;
  }

  createOverlay(): OverlayRef {
    return this.overlay.create(this.getOverlayConfig());
  }

}
