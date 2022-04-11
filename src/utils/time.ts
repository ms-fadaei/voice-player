export function durationToTime(duration: number) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration - minutes * 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
