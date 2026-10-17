import { TestBed } from '@angular/core/testing';

import { App } from './app';
import { AppModule } from './app-module';

describe('App', () => {
  beforeEach(async () => {
    // App is declared in AppModule, so the test uses the real module —
    // the same shell, router and providers the browser gets.
    await TestBed.configureTestingModule({ imports: [AppModule] }).compileComponents();
  });

  it('creates the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the shell: header, a main region for pages, and the toast outlet', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('app-header .navbar__title')?.textContent).toContain('Poké');
    expect(root.querySelector('main router-outlet')).not.toBeNull();
    expect(root.querySelector('app-toast-outlet [aria-live="polite"]')).not.toBeNull();
  });

  it('links every primary page from the header', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const links = [...(fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('.navbar__link')];

    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/home', '/search', '/favorites', '/about']);
  });
});
