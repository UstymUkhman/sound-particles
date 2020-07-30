import SoundParticles from '@/SoundParticles';

const start = document.getElementById('start');

const particles = new SoundParticles(
  document.getElementById('particles'),
  '/assets/music.mp3'
);

window.addEventListener('resize', particles.onResize.bind(particles));

start.addEventListener('click', () => {
  document.getElementById('label').classList.remove('hidden');
  start.classList.add('hidden');
  particles.start();
});
