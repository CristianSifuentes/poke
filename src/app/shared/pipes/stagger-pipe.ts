import { Pipe, PipeTransform } from '@angular/core';

// Entrance delay (ms) for the nth item of a list. Capped, so a long list
// ripples in over the first few items instead of making the last one wait
// seconds — `i | stagger: 30` tops out at 12 × 30 = 360ms.
@Pipe({
  name: 'stagger',
  standalone: false,
})
export class StaggerPipe implements PipeTransform {
  transform(index: number, step = 30, cap = 12): number {
    return Math.min(Math.max(index, 0), cap) * step;
  }
}
