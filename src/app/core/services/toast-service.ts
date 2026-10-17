import { Injectable, signal } from '@angular/core';

export interface ToastOptions {
  message: string;
  actionLabel?: string;
  action?: () => void;
  // Called when the toast goes away without its action being taken.
  dismissed?: () => void;
  duration?: number;
}

export interface Toast extends Required<Pick<ToastOptions, 'message' | 'duration'>> {
  id: number;
  actionLabel?: string;
}

const DEFAULT_DURATION_MS = 5000;

// One toast at a time, app-wide. A new toast replaces the current one
// (dismissing it), which is what you want for quick repeated actions like
// un-hearting several Pokémon in a row: the latest undo is the one offered.
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly current = signal<Toast | null>(null);
  readonly toast = this.current.asReadonly();

  private nextId = 1;
  private timer?: ReturnType<typeof setTimeout>;
  private handlers: Pick<ToastOptions, 'action' | 'dismissed'> = {};

  show(options: ToastOptions): void {
    this.dismiss();
    const toast: Toast = {
      id: this.nextId++,
      message: options.message,
      actionLabel: options.actionLabel,
      duration: options.duration ?? DEFAULT_DURATION_MS,
    };
    this.handlers = { action: options.action, dismissed: options.dismissed };
    this.current.set(toast);
    this.timer = setTimeout(() => this.dismiss(), toast.duration);
  }

  runAction(): void {
    const { action } = this.handlers;
    this.clear();
    action?.();
  }

  dismiss(): void {
    if (!this.current()) {
      return;
    }
    const { dismissed } = this.handlers;
    this.clear();
    dismissed?.();
  }

  private clear(): void {
    clearTimeout(this.timer);
    this.handlers = {};
    this.current.set(null);
  }
}
