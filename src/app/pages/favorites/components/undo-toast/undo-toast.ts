import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-undo-toast',
  standalone: false,
  templateUrl: './undo-toast.html',
  styleUrl: './undo-toast.scss',
})
export class UndoToast {
  @Input() name = '';
  // How long the undo stays available; drives the countdown line.
  @Input() duration = 5000;
  @Output() readonly undo = new EventEmitter<void>();
  @Output() readonly dismiss = new EventEmitter<void>();
}
