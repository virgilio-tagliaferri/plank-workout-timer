import type { Session } from '../types/session.ts';
import type { Preferences } from '../types/preferences.ts';

export type SessionSummary = {
  totalPlankMs: number;
  longestHoldMs: number;
  calories: number;
};

const MET_PLANK = 3.3; // conservative single-value estimate

export function computeSessionSummary(
  session: Session,
  preferences: Preferences
): SessionSummary {
  let totalPlankMs = 0;
  let longestHoldMs = 0;

  for (const segment of session.segments) {
    totalPlankMs += segment.durationMs;
    if (segment.durationMs > longestHoldMs) longestHoldMs = segment.durationMs;
  }

  const totalHours = totalPlankMs / 1000 / 60 / 60;

  const calories = Math.round(MET_PLANK * preferences.weightKg * totalHours);

  return {
    totalPlankMs,
    longestHoldMs,
    calories,
  };
}
