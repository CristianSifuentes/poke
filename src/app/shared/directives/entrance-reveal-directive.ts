import { Directive, HostBinding } from '@angular/core';

// Marks a grid item for the bento mosaic's entrance bloom. The actual
// animation lives in CSS as a @keyframes rule (see .pending-reveal in
// home.scss) rather than a class-toggling transition driven from here —
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
