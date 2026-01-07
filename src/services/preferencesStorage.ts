import type { Preferences } from '../types/preferences.ts';
import { DEFAULT_PREFERENCES } from '../types/preferences.ts';

const KEY = 'plankflow:preferences';

export function loadPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: Preferences) {
  localStorage.setItem(KEY, JSON.stringify(prefs));
}
