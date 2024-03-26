import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent {
  @Input() message = '';
  @Output() confirmEvent = new EventEmitter<boolean>();

  onConfirm(): void {
    this.confirmEvent.emit(true);
  }

  onCancel(): void {
    this.confirmEvent.emit(false);
  }
}
