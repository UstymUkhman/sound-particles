import SoundParticles from '@/SoundParticles';

const start = document.getElementById('start');
const particles = new SoundParticles('/assets/music.mp3');

window.addEventListener('resize', particles.resize.bind(particles));

start.addEventListener('click', () => {
  document.getElementById('label').classList.remove('hidden');
  start.parentElement.classList.add('hidden');
  particles.start();
});
