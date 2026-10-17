import { Component, EventEmitter, Input, Output } from '@angular/core';

export type StatePanelMotion = 'wobble' | 'float' | 'none';

// The app's one way of saying "nothing here" or "something went wrong":
// a line-drawn Poké Ball, a short title, a sentence, and at most one clear
// next step. Anything extra (suggestions, say) is projected between the
// text and the action.
@Component({
  selector: 'app-state-panel',
  standalone: false,
  templateUrl: './state-panel.html',
  styleUrl: './state-panel.scss',
})
export class StatePanel {
  @Input({ required: true }) heading!: string;
  @Input() text = '';
  @Input() tone: 'empty' | 'error' = 'empty';
  @Input() motion: StatePanelMotion = 'wobble';
  @Input() actionLabel = '';
  // When set, the action is a link; otherwise it's a button emitting `action`.
  @Input() actionLink: string | null = null;
  @Output() readonly action = new EventEmitter<void>();
}
