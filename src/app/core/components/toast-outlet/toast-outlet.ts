import { Component, computed, inject } from '@angular/core';

import { ToastService } from '../../services/toast-service';

// Renders ToastService's current toast. Lives in the app shell, so any
// page (or a heart button anywhere) can raise feedback with an undo.
@Component({
  selector: 'app-toast-outlet',
  standalone: false,
  templateUrl: './toast-outlet.html',
  styleUrl: './toast-outlet.scss',
})
export class ToastOutlet {
  protected readonly toasts = inject(ToastService);
  // As a one-item list so each new toast is a fresh element (trackBy id),
  // which restarts its entrance and countdown animations.
  protected readonly queue = computed(() => {
    const toast = this.toasts.toast();
    return toast ? [toast] : [];
  });

  protected trackById(_index: number, toast: { id: number }): number {
    return toast.id;
  }
}
