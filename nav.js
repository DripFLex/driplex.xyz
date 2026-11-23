// Shared sidebar + theme toggle (dark by default)
const root = document.documentElement;

const I = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const links = [
  ['index.html', 'HOME', '<path d="M3 10 12 3l9 7v11h-6v-7H9v7H3z"/>'],
  ['about.html', 'ABOUT', '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>'],
  ['now.html', 'NOW', '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'],
  ['blog.html', 'LOGBOOK', '<path d="M4 20h4L20 8l-4-4L4 16z"/><path d="M14 6l4 4"/>'],
  ['photos.html', 'PHOTOS', '<rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M8 6l2-3h4l2 3"/>'],
  ['map.html', 'MAP', '<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>'],
  ['training.html', 'TRAINING', '<path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/>'],
  ['stuff.html', 'STUFF', '<path d="M12 3 3 8v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/>'],
];
const here = location.pathname.split('/').pop() || 'index.html';
const nav = document.createElement('nav');
nav.className = 'rail';
nav.setAttribute('aria-label', 'Main navigation');
nav.innerHTML = `<div class="rail-panel">${links.map(([h, l, d]) =>
  `<a href="${h}" aria-label="${l}" class="${h === here ? 'on' : ''}">${I(d)}</a>`).join('')}
  <div class="sep"></div>
  <button aria-label="Toggle theme">${I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>')}</button></div>`;
document.body.prepend(nav);
nav.querySelector('button').onclick = () => {
  const light = root.classList.toggle('light');
  try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch (e) {}
};
