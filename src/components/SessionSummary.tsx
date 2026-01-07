type Props = {
  totalPlankMs: number;
  longestHoldMs: number;
  calories: number;
  onRestart: () => void;
};

function formatMs(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function SessionSummary({
  totalPlankMs,
  longestHoldMs,
  calories,
  onRestart,
}: Props) {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Session summary</h2>

      <p>Total plank time: {formatMs(totalPlankMs)}</p>
      <p>Longest hold: {formatMs(longestHoldMs)}</p>
      <p>Estimated calories burned: {calories} kcal</p>

      <button
        className='start-button'
        style={{ marginTop: 16 }}
        onClick={onRestart}
      >
        Restart
      </button>
    </div>
  );
}
