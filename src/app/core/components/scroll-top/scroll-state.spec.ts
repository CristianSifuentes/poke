import { readScrollState } from './scroll-state';

describe('readScrollState', () => {
  const viewport = 800;

  it('stays hidden near the top', () => {
    expect(readScrollState(100, viewport, 4000).visible).toBe(false);
  });

  it('appears after most of a screen', () => {
    const state = readScrollState(600, viewport, 4000);

    expect(state.visible).toBe(true);
    expect(state.progress).toBeCloseTo(600 / 3200);
  });

  it('never shows on pages too short to need it', () => {
    expect(readScrollState(300, viewport, 1100).visible).toBe(false);
  });

  it('reports completion at the bottom, tolerating rounding', () => {
    const state = readScrollState(3199, viewport, 4000);

    expect(state.progress).toBeCloseTo(1, 2);
    expect(state.complete).toBe(true);
  });

  it('clamps progress and handles pages that do not scroll', () => {
    expect(readScrollState(-50, viewport, 4000).progress).toBe(0);
    expect(readScrollState(0, viewport, 500)).toEqual({ visible: false, progress: 0, complete: false });
  });
});
