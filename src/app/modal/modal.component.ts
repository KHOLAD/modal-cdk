import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  AfterViewInit,
  EventEmitter
} from '@angular/core';
import { Output } from '@angular/core';
import { Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ModalService } from './modal.service';
import { CdkPortal } from '@angular/cdk/portal';
import { OverlayRef } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ui-modal',
  template: `
  <div *cdkPortal class="ui-modal">
    <ng-content></ng-content>
  </div>
  `,
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements AfterViewInit {
  private _overlayRef: OverlayRef;
  /**
   * Events
   */
  private backdropClick$: Subscription;
  private onCloseEvent$: Subscription;
  @Output() onClose = new EventEmitter();
  @Output() onOpen = new EventEmitter();
  /**
   * Main component portal container
   */
  @ViewChild(CdkPortal, {static: false}) portal;

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: ModalService
  ) { }

  ngOnDestroy() {
    this.closeModal();
  }

  ngAfterViewInit() {
     // Dispose before attach new modal template
     if (this._overlayRef && this._overlayRef.hasAttached()) { this.closeModal(); }
     // Opens on init
     this.open();
     // Outside click detection
     this.backdropClick$ = this._overlayRef.backdropClick().subscribe(() => this.closeModal());
     // On Close detection
     this.onCloseEvent$ = this.modalService.onClose.subscribe(() => this._close());
  }

  closeModal() {
    this.modalService.onClose.next(true);
  }

  open() {
    this._overlayRef = this.modalService.createOverlay();
    this._overlayRef.attach(this.portal);
    this.onOpen.emit();
  }

  private  _close() {
    // Onclose eventemitter
    this.onClose.emit();
    // Event handlers
    this.backdropClick$.unsubscribe();
    this.onCloseEvent$.unsubscribe();
    // Disposing overlay
    this._overlayRef.detach();
    this._overlayRef.dispose();
  }

}
