export type Level = 0 | 1 | 2 | 3 | 4;

export const LEVEL_LABELS = [
  'Beginner',
  'Novice',
  'Intermediate',
  'Advanced',
  'Expert',
] as const;

// Harder → longer work, shorter rest
const EXERCISE_BY_LEVEL = [35, 40, 45, 60, 70] as const;
const SHORT_BREAK_BY_LEVEL = [20, 18, 15, 12, 10] as const;
const LONG_BREAK_BY_LEVEL = [70, 65, 60, 50, 45] as const;

export type WorkoutConfig = {
  exerciseDuration: number;
  shortBreak: number;
  longBreak: number;
};

export function configFromLevel(level: Level): WorkoutConfig {
  return {
    exerciseDuration: EXERCISE_BY_LEVEL[level],
    shortBreak: SHORT_BREAK_BY_LEVEL[level],
    longBreak: LONG_BREAK_BY_LEVEL[level],
  };
}
