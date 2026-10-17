import { Component, HostListener, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

import { FavoritesStore } from '../../services/favorites-store';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  protected readonly favorites = inject(FavoritesStore);
  private readonly router = inject(Router);

  // A Pokémon's detail page lives inside the Pokédex, so its nav link
  // stays lit there too — routerLinkActive alone only matches /search.
  protected readonly inPokedex = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.startsWith('/pokemon/')),
    ),
    { initialValue: false },
  );

  protected readonly title = signal('poke');

  protected readonly isMenuOpen = signal(false);

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  // "/" opens search from anywhere. On /search itself the search bar
  // handles the key (it just focuses), so this only covers other pages.
  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }
    const target = event.target as HTMLElement | null;
    if (target?.closest('input, textarea, select, [contenteditable="true"]')) {
      return;
    }
    if (this.router.url.startsWith('/search')) {
      return;
    }
    event.preventDefault();
    this.router.navigate(['/search'], { state: { focusSearch: true } });
  }

}
