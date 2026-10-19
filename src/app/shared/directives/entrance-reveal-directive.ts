import { Directive, HostBinding } from '@angular/core';

// Marks a card for the app-wide entrance bloom. The actual animation lives
// in CSS: the `bloom` mixin in src/styles/_poke.scss styles .pending-reveal
// with the global poke-bloom @keyframes, rather than a class-toggling transition driven from here —
// keyframe animations play their whole timeline the instant the class
// exists in the DOM, so there is no "did the browser paint the before-state
// in time" race to lose against page bootstrap, image loads, or anything
// else competing for the first frame. prefers-reduced-motion is likewise
// handled declaratively in CSS, so this directive has nothing left to do
// at runtime beyond flagging the host as a participant.
@Directive({
  selector: '[appEntranceReveal]',
  standalone: false,
})
export class EntranceRevealDirective {
  @HostBinding('class.pending-reveal')
  readonly pending = true;
}
