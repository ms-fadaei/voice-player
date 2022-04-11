export function filterData(audioBuffer: AudioBuffer, samples: number): number[] {
  const rawData = audioBuffer.getChannelData(0);
  const blockSize = Math.floor(rawData.length / samples);
  const filteredData = [];
  for (let i = 0; i < samples; i++) {
    filteredData.push(Math.abs(rawData[i * blockSize]));
  }

  return filteredData;
}

export function normalizeData(data: number[]) {
  const multiplier = Math.pow(Math.max(...data), -1);
  return data.map((d) => d * multiplier);
}
