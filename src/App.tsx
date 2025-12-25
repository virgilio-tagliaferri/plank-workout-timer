import { useEffect, useState } from 'react';
import { WORKOUT } from './data/workout';

const DEBUG = import.meta.env.DEV;

type Phase =
  | 'idle'
  | 'config'
  | 'countdown'
  | 'exercise'
  | 'break'
  | 'finished';

type WorkoutConfig = {
  exerciseDuration: number;
  shortBreak: number;
  longBreak: number;
};
type Level = 0 | 1 | 2;

const LEVEL_LABELS = [
  'Beginner',
  'Novice',
  'Intermediate',
  'Advanced',
  'Expert',
] as const;

// Harder (right) => longer work, shorter rest
const EXERCISE_BY_LEVEL = [35, 40, 45, 60, 70] as const;
const SHORT_BREAK_BY_LEVEL = [20, 18, 15, 12, 10] as const;
const LONG_BREAK_BY_LEVEL = [70, 65, 60, 50, 45] as const;

function configFromLevel(level: Level) {
  return {
    exerciseDuration: EXERCISE_BY_LEVEL[level],
    shortBreak: SHORT_BREAK_BY_LEVEL[level],
    longBreak: LONG_BREAK_BY_LEVEL[level],
  };
}

export default function App() {
  const TIME_SCALE = DEBUG ? 0.2 : 1;

  // ---------- STATE ----------
  const [phase, setPhase] = useState<Phase>('idle');
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [confirmAbort, setConfirmAbort] = useState(false);
  const [level, setLevel] = useState<Level>(2); // 2 = Intermediate default
  const [config, setConfig] = useState<WorkoutConfig>(() => configFromLevel(1));
  // ---------- DERIVED ----------
  const currentExercise = WORKOUT[currentIndex];

  const displayExercise =
    phase === 'countdown'
      ? WORKOUT[0]
      : phase === 'break'
      ? WORKOUT[currentIndex + 1]
      : currentExercise;

  const isPastHalfway =
    phase === 'exercise' &&
    timeLeft <= Math.ceil((config.exerciseDuration * TIME_SCALE) / 2);

  const isEnding = phase === 'exercise' && timeLeft > 0 && timeLeft <= 5;

  useEffect(() => {
    setConfig(configFromLevel(level));
  }, [level]);

  useEffect(() => {
    if (!isEnding || isPaused) return;

    vibrate(40);
  }, [timeLeft, isEnding, isPaused]);

  // ---------- HELPERS ----------
  function getBreakDuration(index: number) {
    return index === 4 ? config.longBreak : config.shortBreak;
  }
  // ---------- SOUNDS & VIBRATION ----------
  const [prevPhase, setPrevPhase] = useState<Phase | null>(null);

  function playSound(name: 'play' | 'pause' | 'success') {
    const audio = new Audio(`/sounds/${name}.mp3`);
    audio.volume = 0.6;
    audio.play().catch(() => {});
  }
  function vibrate(pattern: number | number[]) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  useEffect(() => {
    if (prevPhase === null) {
      setPrevPhase(phase);
      return;
    }

    // Countdown → Exercise
    if (prevPhase === 'countdown' && phase === 'exercise') {
      playSound('play');
      vibrate(100);
    }

    // Workout finished
    if (phase === 'finished') {
      playSound('success');
      vibrate([100, 50, 100]);
    }

    setPrevPhase(phase);
  }, [phase]);

  // ---------- TIMER ----------
  useEffect(() => {
    if (
      phase === 'idle' ||
      phase === 'config' ||
      phase === 'finished' ||
      isPaused
    ) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, isPaused]);

  useEffect(() => {
    if (timeLeft !== 0 || isPaused) return;

    // Countdown → Exercise
    if (phase === 'countdown') {
      setPhase('exercise');
      setTimeLeft(Math.ceil(config.exerciseDuration * TIME_SCALE));
      return;
    }

    // Exercise → Break or Finish
    if (phase === 'exercise') {
      if (currentIndex === WORKOUT.length - 1) {
        setPhase('finished');
        return;
      }

      setPhase('break');
      setTimeLeft(Math.ceil(getBreakDuration(currentIndex) * TIME_SCALE));
      return;
    }

    // Break → Next Exercise
    if (phase === 'break') {
      setCurrentIndex((i) => i + 1);
      setPhase('exercise');
      setTimeLeft(Math.ceil(config.exerciseDuration * TIME_SCALE));
    }
  }, [timeLeft, phase, currentIndex, isPaused, config.exerciseDuration]);

  // ---------- ACTIONS ----------
  function goToConfig() {
    setPhase('config');
  }

  function beginWorkout() {
    setCurrentIndex(0);
    setTimeLeft(10 * TIME_SCALE);
    setIsPaused(false);
    setConfirmAbort(false);
    setPhase('countdown');
  }

  function togglePause() {
    setIsPaused((p) => {
      const next = !p;
      playSound(next ? 'pause' : 'play');
      vibrate(next ? 50 : 30);
      return next;
    });
    setConfirmAbort(false);
  }

  function next() {
    if (currentIndex < WORKOUT.length - 1) {
      setCurrentIndex((i) => i + 1);
      setPhase('exercise');
      setTimeLeft(Math.ceil(config.exerciseDuration * TIME_SCALE));
      setConfirmAbort(false);
    }
  }

  function previous() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setPhase('exercise');
      setTimeLeft(Math.ceil(config.exerciseDuration * TIME_SCALE));
      setConfirmAbort(false);
    }
  }

  function abortWorkout() {
    if (!confirmAbort) {
      setConfirmAbort(true);
      return;
    }

    setPhase('idle');
    setCurrentIndex(0);
    setTimeLeft(5);
    setIsPaused(false);
    setConfirmAbort(false);
  }
  function cancelAbortConfirm() {
    setConfirmAbort(false);
  }

  // ---------- RENDER ----------
  return (
    <main
      className={`workout-container ${
        phase === 'exercise'
          ? 'workout-active'
          : phase === 'break' || phase === 'countdown'
          ? 'workout-inactive'
          : ''
      }`}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

        textAlign: 'center',
      }}
    >
      {/* ---------- DEBUG FLAG ---------- */}
      {DEBUG && (
        <div
          style={{
            opacity: 0.2,
            fontSize: '1rem',
            position: 'absolute',
            top: '0.5rem',
            outline: '1px dashed',
            padding: '0.5rem',
          }}
        >
          Debug mode (×{1 / TIME_SCALE})
        </div>
      )}
      {/* ---------- IDLE ---------- */}
      {phase === 'idle' && (
        <>
          <h1 style={{ marginTop: '0', marginBottom: '0' }}>
            Guided Plank Workout
          </h1>

          <p
            style={{
              maxWidth: 320,
              marginTop: 12,
              marginBottom: 32,
            }}
          >
            Stay focused through a full plank routine, timed and structured for
            you.
          </p>
          <button className='start-button' onClick={goToConfig}>
            Set up workout
          </button>
        </>
      )}

      {/* ---------- CONFIG ---------- */}
      {phase === 'config' && (
        <div style={{ maxWidth: 400, width: '90%' }}>
          <h2 style={{ marginTop: 0 }}>Workout Settings</h2>

          <p style={{}}>
            Choose your difficulty level. Each of the ten exercises is timed for
            you, with guided transitions and rest in between.
          </p>

          <div style={{ marginBottom: 32, marginTop: 32 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>
              Difficulty: <strong>{LEVEL_LABELS[level]}</strong>
            </label>

            <input
              style={{ width: '100%', maxWidth: 320 }}
              type='range'
              min={0}
              max={4}
              step={1}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value) as Level)}
            />

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12,
                opacity: 0.6,
                marginTop: 4,
                padding: '0 8px',
              }}
            >
              {/*<span>Beginner</span>
              <span>Intermediate</span>
              <span>Advanced</span>*/}
            </div>
            <p style={{ margin: '0.5rem' }}>
              Plank hold: <strong>{config.exerciseDuration}s</strong>
            </p>
            <p style={{ margin: '0.5rem' }}>
              Short break: <strong>{config.shortBreak}s</strong>
            </p>
            <p style={{ margin: '0.5rem' }}>
              Long break: <strong>{config.longBreak}s</strong>
            </p>
          </div>

          <button
            className='start-button'
            onClick={beginWorkout}
            style={{ marginTop: 20 }}
          >
            Begin workout
          </button>
        </div>
      )}

      {/* ---------- WORKOUT ---------- */}
      {(phase === 'countdown' || phase === 'exercise' || phase === 'break') && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            width: '100%',
            maxWidth: 400,
          }}
        >
          <h4 style={{ marginTop: '0' }}>
            {currentIndex + 1} / {WORKOUT.length}
          </h4>
          <div className='phase-header'>
            {/* COUNTDOWN */}
            <div
              className={`phase-content ${
                phase === 'countdown' ? 'active' : ''
              }`}
            >
              <h4 style={{ margin: '0' }}>Get into position</h4>
              <h2 style={{ marginTop: '0' }}>{currentExercise.name}</h2>
            </div>
            {/* EXERCISE */}
            <div
              className={`phase-content ${
                phase === 'exercise' ? 'active' : ''
              }`}
            >
              <h4 style={{ margin: '0' }}>Hold steady</h4>
              <h2 style={{ marginTop: '0' }}>{currentExercise.name}</h2>
            </div>
            {/* BREAK */}
            <div
              className={`phase-content ${phase === 'break' ? 'active' : ''}`}
            >
              <h4 style={{ margin: '0' }}>Up next:</h4>
              <h2 style={{ marginTop: '0' }}>
                {WORKOUT[currentIndex + 1]?.name}
              </h2>
            </div>
          </div>

          {displayExercise?.image && (
            <div className='exercise-image-wrapper'>
              <img
                src={displayExercise.image}
                alt={displayExercise.name}
                className={`exercise-image ${
                  displayExercise.canMirror && isPastHalfway ? 'mirrored' : ''
                }`}
              />
            </div>
          )}

          <p
            className={`timer ${isPaused ? 'paused' : ''} ${
              isEnding ? 'ending' : ''
            }`}
            style={{ fontSize: 48, margin: '16px 0' }}
            aria-live='polite'
          >
            {timeLeft}s
          </p>

          <div className='controlPanel'>
            <button
              onClick={previous}
              disabled={currentIndex === 0}
              style={{ marginRight: 12 }}
            >
              <span
                className='material-symbols-rounded'
                style={{ marginRight: 6 }}
              >
                skip_previous
              </span>
              Back
            </button>

            <button
              onClick={togglePause}
              className={`pause-button ${isPaused ? 'is-resume' : ''}`}
              aria-label={isPaused ? 'Resume workout' : 'Pause workout'}
            >
              <span className='material-symbols-rounded' aria-hidden='true'>
                {isPaused ? 'play_arrow' : 'pause'}
              </span>
            </button>

            <button
              onClick={next}
              disabled={currentIndex === WORKOUT.length - 1}
              style={{ marginLeft: 12 }}
            >
              Skip{' '}
              <span
                className='material-symbols-rounded'
                style={{ marginLeft: 6 }}
              >
                skip_next
              </span>
            </button>
          </div>
          {/* END BUTTON + RENDER CANCEL BACKDROP */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              abortWorkout();
            }}
            className='abort-button'
            style={{ marginTop: 24 }}
          >
            {confirmAbort ? 'Tap again to confirm' : 'End workout'}
          </button>
          {confirmAbort && (
            <button
              type='button'
              className='abort-backdrop'
              onClick={cancelAbortConfirm}
              aria-label='Cancel end workout confirmation'
            />
          )}
        </div>
      )}

      {/* ---------- FINISHED ---------- */}
      {phase === 'finished' && (
        <>
          <h1>Plank Workout Timer</h1>
          <h2>Workout complete 🎉</h2>
          <button className='start-button' onClick={goToConfig}>
            Restart
          </button>
        </>
      )}
    </main>
  );
}
