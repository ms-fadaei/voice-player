import type { IWindow } from 'happy-dom';
import { beforeEach, describe, it, vi, expect } from 'vitest';
import '~/elements/telegram-voice-player';

describe('Button with increment', async () => {
  beforeEach(async () => {
    document.body.innerHTML = '<telegram-voice-player src="/audio.mp3"></telegram-voice-player>';
    await (window as unknown as IWindow).happyDOM.whenAsyncComplete();
    await requestUpdate();
  });

  function requestUpdate() {
    return document.body.querySelector('telegram-voice-player')?.requestUpdate();
  }
});
