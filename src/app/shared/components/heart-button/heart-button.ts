import { Component, Input, inject, signal } from '@angular/core';

import { FavoritesStore } from '../../../core/services/favorites-store';
import { ToastService } from '../../../core/services/toast-service';

// Every card's way into the favorites collection. Owns no state of its own:
// it reads and writes FavoritesStore, so the same Pokémon's heart stays in
// sync on every page and in every open tab. Removing offers an undo toast.
@Component({
  selector: 'app-heart-button',
  standalone: false,
  templateUrl: './heart-button.html',
  styleUrl: './heart-button.scss',
})
export class HeartButton {
  private readonly favorites = inject(FavoritesStore);
  private readonly toasts = inject(ToastService);

  @Input({ required: true }) pokemonId!: number;
  // Display name, for the accessible label.
  @Input() label = '';
  // The burst takes the Pokémon's primary type color.
  @Input() type: string | null | undefined;

  protected readonly particles = Array.from({ length: 8 }, (_, i) => i);
  // One key per burst. A new key re-creates the burst element (trackBy),
  // which restarts its CSS animation from frame zero.
  protected readonly bursts = signal<number[]>([]);

  protected get active(): boolean {
    return this.favorites.has(this.pokemonId);
  }

  protected toggle(event: MouseEvent): void {
    event.stopPropagation();
    const adding = !this.active;
    this.favorites.toggle(this.pokemonId);
    this.bursts.set(adding ? [Date.now()] : []);
    if (!adding) {
      // Un-hearting is easy to do by accident, so it's always undoable,
      // from whichever page it happened on.
      this.toasts.show({
        message: `${this.label || 'Pokémon'} left your favorites.`,
        actionLabel: 'Undo',
        action: () => this.favorites.undoRemove(),
        dismissed: () => this.favorites.dismissUndo(),
      });
    }
  }

  protected trackByKey(_index: number, key: number): number {
    return key;
  }
}
