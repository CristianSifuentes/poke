export interface ScrollState {
  visible: boolean;
  // 0 at the top, 1 at the very bottom.
  progress: number;
  complete: boolean;
}

// Where the reader is on the page. The button shows once they've scrolled
// past most of a screen, and only on pages long enough to need it.
export function readScrollState(scrollY: number, viewportHeight: number, documentHeight: number): ScrollState {
  const scrollable = Math.max(documentHeight - viewportHeight, 0);
  const progress = scrollable > 0 ? Math.min(Math.max(scrollY / scrollable, 0), 1) : 0;
  return {
    visible: scrollable > viewportHeight * 0.5 && scrollY > viewportHeight * 0.6,
    progress,
    // A couple of pixels short still counts: browsers round scroll offsets.
    complete: scrollable > 0 && scrollY >= scrollable - 2,
  };
}
