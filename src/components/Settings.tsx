import { usePreferences } from '../hooks/usePreferences.ts';

export function Settings() {
  const prefs = usePreferences();
  const preferences = prefs.preferences;
  const setPreferences = prefs.setPreferences;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Settings</h2>

      {/* Feedback */}
      <section>
        <h3>Feedback</h3>

        <label>
          <input
            type='checkbox'
            checked={preferences.vibration}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                vibration: e.target.checked,
              })
            }
          />
          Vibration
        </label>

        <br />

        <label>
          <input
            type='checkbox'
            checked={preferences.sound}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                sound: e.target.checked,
              })
            }
          />
          Sound
        </label>
      </section>

      {/* Body data */}
      <section style={{ marginTop: '1rem' }}>
        <h3>Body data</h3>

        <label>
          Weight (kg)
          <input
            type='number'
            value={preferences.weightKg}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                weightKg: Number(e.target.value) || 70,
              })
            }
          />
        </label>

        <br />

        <label>
          Height (cm)
          <input
            type='number'
            value={preferences.heightCm}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                heightCm: Number(e.target.value) || 170,
              })
            }
          />
        </label>
      </section>
    </div>
  );
}
