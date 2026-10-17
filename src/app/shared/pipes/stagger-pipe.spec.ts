import { StaggerPipe } from './stagger-pipe';

describe('StaggerPipe', () => {
  const pipe = new StaggerPipe();

  it('multiplies the index by the step', () => {
    expect(pipe.transform(3, 40)).toBe(120);
  });

  it('caps long lists so late items never wait long', () => {
    expect(pipe.transform(200, 30)).toBe(360);
    expect(pipe.transform(200, 30, 4)).toBe(120);
  });

  it('treats negative indexes as the first item', () => {
    expect(pipe.transform(-2)).toBe(0);
  });
});
