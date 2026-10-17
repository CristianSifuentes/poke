import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: false,
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar implements AfterViewInit {
  @Input() query = '';
  @Input() resultCount = 0;
  @Input() loading = false;
  @Output() readonly queryChange = new EventEmitter<string>();

  @ViewChild('searchInput', { static: true }) private readonly input!: ElementRef<HTMLInputElement>;

  // Arriving via the header's "/" shortcut from another page.
  ngAfterViewInit(): void {
    if (typeof history !== 'undefined' && history.state?.focusSearch) {
      this.input.nativeElement.focus();
    }
  }

  // "/" jumps to search from anywhere on the page, the same shortcut
  // GitHub, YouTube and MDN use — unless the user is already typing.
  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }
    const target = event.target as HTMLElement | null;
    if (target?.closest('input, textarea, select, [contenteditable="true"]')) {
      return;
    }
    event.preventDefault();
    this.input.nativeElement.focus();
  }

  protected onInput(event: Event): void {
    this.queryChange.emit((event.target as HTMLInputElement).value);
  }

  // First Escape clears the query; a second one leaves the field.
  protected onEscape(): void {
    if (this.query) {
      this.queryChange.emit('');
    } else {
      this.input.nativeElement.blur();
    }
  }

  protected clear(): void {
    this.queryChange.emit('');
    this.input.nativeElement.focus();
  }
}
