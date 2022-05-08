import { initTelegramVoicePlayer } from '~/index';
import '@/style.css';

initTelegramVoicePlayer();

const player = document.getElementsByClassName('player')[0];

const barsRange = document.getElementById('bars');
barsRange?.addEventListener('change', (e) => {
  const bars = (e.target as HTMLInputElement).valueAsNumber;
  player.setAttribute('bars', `${bars}`);
});

const mirroredBarsCheckbox = document.getElementById('mirrored-bars');
mirroredBarsCheckbox?.addEventListener('change', (e) => {
  const checked = (e.target as HTMLInputElement).checked;
  if (checked) {
    player.setAttribute('mirroredbars', '');
  } else {
    player.removeAttribute('mirroredbars');
  }
});
