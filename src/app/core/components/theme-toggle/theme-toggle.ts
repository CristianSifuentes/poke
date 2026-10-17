import { Component, inject } from '@angular/core';

import { ThemeService } from '../../services/theme-service';

// A sun that folds its rays and becomes a crescent moon. Clicking it
// starts the theme reveal from the button's own center.
@Component({
  selector: 'app-theme-toggle',
  standalone: false,
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
})
export class ThemeToggle {
  protected readonly themes = inject(ThemeService);

  protected toggle(event: MouseEvent): void {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    this.themes.toggle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  }
}
