export function filterData(audioBuffer: AudioBuffer, samples: number): number[] {
  const rawData = audioBuffer.getChannelData(0);
  const blockSize = Math.floor(rawData.length / samples);
  const filteredData = [];
  for (let i = 0; i < samples; i++) {
    let sumOfRandomData = 0;
    const samplesCount = blockSize < 16 ? blockSize : 16;
    for (let j = 0; j < samplesCount; j++) {
      const randomIndex = Math.floor(Math.random() * blockSize) + i * blockSize;
      sumOfRandomData += Math.abs(rawData[randomIndex]);
    }
    filteredData.push(sumOfRandomData / samplesCount);
  }

  return filteredData;
}

export function normalizeData(data: number[]) {
  const multiplier = Math.pow(Math.max(...data), -1);
  return data.map((d) => d * multiplier);
}
