export type Preferences = {
  vibration: boolean;
  sound: boolean;
  weightKg: number;
  heightCm: number;
};

export const DEFAULT_PREFERENCES: Preferences = {
  vibration: true,
  sound: false,
  weightKg: 70,
  heightCm: 170,
};
