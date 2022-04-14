import '~/index';
import '@/style.css';

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

const bchrrRange = document.getElementById('bchrr');
bchrrRange?.addEventListener('change', (e) => {
  const value = (e.target as HTMLInputElement).valueAsNumber;
  player.setAttribute('barcenterholeradiusratio', `${value}`);
});

const bbrrRange = document.getElementById('bbrr');
bbrrRange?.addEventListener('change', (e) => {
  const value = (e.target as HTMLInputElement).valueAsNumber;
  player.setAttribute('barmaxradiusratio', `${value}`);
});

const bgrRange = document.getElementById('bgr');
bgrRange?.addEventListener('change', (e) => {
  const value = (e.target as HTMLInputElement).valueAsNumber;
  player.setAttribute('bargapratio', `${value}`);
});

const bmRange = document.getElementById('bm');
bmRange?.addEventListener('change', (e) => {
  const value = (e.target as HTMLInputElement).value;
  player.setAttribute('barmode', `${value}`);
});
