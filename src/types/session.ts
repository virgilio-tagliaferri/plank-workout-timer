export type PlankSide = 'front' | 'left' | 'right';

export type PlankSegment = {
  side: PlankSide;
  durationMs: number;
};

export type Session = {
  startedAt: number;
  segments: PlankSegment[];
};
