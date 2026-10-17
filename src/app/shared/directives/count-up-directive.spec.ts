import { Component, NgModule, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SharedModule } from '../shared-module';

@Component({
  standalone: false,
  template: `<span [appCountUp]="value()"></span>`,
})
class HostComponent {
  readonly value = signal(1025);
}

// The directive is declared in SharedModule, so the host joins a module
// that imports it — the same way every feature module consumes it.
@NgModule({ declarations: [HostComponent], imports: [SharedModule] })
class HostModule {}

describe('CountUpDirective', () => {
  afterEach(() => vi.unstubAllGlobals());

  function render(): { fixture: ReturnType<typeof TestBed.createComponent<HostComponent>>; span: HTMLElement } {
    TestBed.configureTestingModule({ imports: [HostModule] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return { fixture, span: fixture.nativeElement.querySelector('span') };
  }

  it('shows the final, formatted value when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const { span } = render();

    expect(span.textContent).toBe('1,025');
  });

  it('starts at zero until the host scrolls into view', () => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe(): void {}
        disconnect(): void {}
      },
    );
    const { span } = render();

    expect(span.textContent).toBe('0');
  });

  it('writes later changes straight through once finished', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const { fixture, span } = render();

    fixture.componentInstance.value.set(3);
    fixture.detectChanges();

    expect(span.textContent).toBe('3');
  });
});
