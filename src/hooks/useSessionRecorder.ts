import { useRef } from 'react';
import type { Session, PlankSide } from '../types/session.ts';

export function useSessionRecorder() {
  const sessionRef = useRef<Session | null>(null);
  const segmentStartRef = useRef<number | null>(null);
  const currentSideRef = useRef<PlankSide | null>(null);

  const startSession = () => {
    sessionRef.current = {
      startedAt: Date.now(),
      segments: [],
    };
  };

  const startSegment = (side: PlankSide) => {
    currentSideRef.current = side;
    segmentStartRef.current = Date.now();
  };

  const endSegment = () => {
    if (
      !sessionRef.current ||
      !segmentStartRef.current ||
      !currentSideRef.current
    ) {
      return;
    }

    const durationMs = Date.now() - segmentStartRef.current;

    sessionRef.current.segments.push({
      side: currentSideRef.current,
      durationMs,
    });

    segmentStartRef.current = null;
    currentSideRef.current = null;
  };

  const endSession = (): Session | null => {
    endSegment();
    return sessionRef.current;
  };

  return {
    startSession,
    startSegment,
    endSegment,
    endSession,
  };
}
