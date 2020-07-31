import SoundParticles from '@/SoundParticles';

const start = document.getElementById('start');
const particles = new SoundParticles('/assets/music.mp3');

window.addEventListener('resize', particles.onResize.bind(particles));

start.addEventListener('click', () => {
  document.getElementById('label').classList.remove('hidden');
  // setTimeout(particles.start.bind(particles), 100);
  start.parentElement.classList.add('hidden');
  particles.start();
});
