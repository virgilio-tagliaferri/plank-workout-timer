import { useEffect, useState } from 'react';
import type { Preferences } from '../types/preferences';
import {
  loadPreferences,
  savePreferences,
} from '../services/preferencesStorage';

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(loadPreferences);

  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  return { preferences, setPreferences };
}
