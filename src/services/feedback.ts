export type SoundName = 'play' | 'pause' | 'success';

export function playSound(name: SoundName) {
  const audio = new Audio(`/sounds/${name}.mp3`);
  audio.volume = 0.6;
  audio.play().catch(() => {});
}

export function vibrate(pattern: number | number[]) {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}
