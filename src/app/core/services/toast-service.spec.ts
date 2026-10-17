import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast-service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = TestBed.inject(ToastService);
  });

  afterEach(() => vi.useRealTimers());

  it('shows a toast and dismisses it after its duration', () => {
    const dismissed = vi.fn();
    service.show({ message: 'Saved', duration: 1000, dismissed });

    expect(service.toast()?.message).toBe('Saved');

    vi.advanceTimersByTime(1000);
    expect(service.toast()).toBeNull();
    expect(dismissed).toHaveBeenCalledOnce();
  });

  it('runs the action once and does not count it as a dismissal', () => {
    const action = vi.fn();
    const dismissed = vi.fn();
    service.show({ message: 'Removed', actionLabel: 'Undo', action, dismissed });

    service.runAction();
    service.runAction();
    vi.runAllTimers();

    expect(action).toHaveBeenCalledOnce();
    expect(dismissed).not.toHaveBeenCalled();
    expect(service.toast()).toBeNull();
  });

  it('replaces the current toast, dismissing the previous one', () => {
    const first = vi.fn();
    service.show({ message: 'First', dismissed: first });
    service.show({ message: 'Second' });

    expect(first).toHaveBeenCalledOnce();
    expect(service.toast()?.message).toBe('Second');
  });
});
