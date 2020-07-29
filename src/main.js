import SoundParticles from '@/SoundParticles';

const particles = new SoundParticles();
const start = document.getElementById('start');

// window.addEventListener('resize', particles.onResize.bind(particles));

start.addEventListener('click', () => {
  document.getElementById('label').classList.remove('hidden');
  start.classList.add('hidden');
  particles.start();
});
