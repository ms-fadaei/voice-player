import type { IWindow } from 'happy-dom';
import { beforeEach, describe, it, vi, expect } from 'vitest';
import '~/elements/telegram-voice-player';

describe('Button with increment', async () => {
  beforeEach(async () => {
    document.body.innerHTML = '<telegram-voice-player name="World"></telegram-voice-player>';
    await (window as unknown as IWindow).happyDOM.whenAsyncComplete();
    await requestUpdate();
  });

  function getInsideButton(): HTMLElement | null | undefined {
    return document.body.querySelector('telegram-voice-player')?.shadowRoot?.querySelector('button');
  }

  function requestUpdate() {
    return document.body.querySelector('telegram-voice-player')?.requestUpdate();
  }

  it('should increment the count on each click', async () => {
    getInsideButton()?.click();
    await requestUpdate();
    expect(getInsideButton()?.innerText).toContain('1');
  });

  it('should show name props', () => {
    getInsideButton();
    expect(document.body.querySelector('telegram-voice-player')?.shadowRoot?.innerHTML).toContain('World');
  });

  it('should dispatch count event on button click', () => {
    const spyClick = vi.fn();

    document.querySelector('telegram-voice-player')?.addEventListener('count', spyClick);

    getInsideButton()?.click();

    expect(spyClick).toHaveBeenCalled();
  });
});
