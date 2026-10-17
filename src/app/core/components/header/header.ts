import { Component, inject, signal } from '@angular/core';

import { FavoritesStore } from '../../services/favorites-store';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  protected readonly favorites = inject(FavoritesStore);

  protected readonly title = signal('poke');

  protected readonly isMenuOpen = signal(false);

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

}
