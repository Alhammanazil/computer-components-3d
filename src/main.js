import './style.css';
import { Viewer } from './viewer.js';
import { homeView } from './views/home.js';
import { learnListView, learnDetailView } from './views/learn.js';
import { quizView } from './views/quiz.js';

const app = document.getElementById('app');
app.innerHTML = `
  <header class="topbar">
    <a class="brand" href="#/"><span class="brand-logo">🖥️</span><span>Komponen<b>ku</b></span></a>
    <nav class="nav">
      <a href="#/" data-nav="home"><i>🏠</i><span>Beranda</span></a>
      <a href="#/belajar" data-nav="belajar"><i>📘</i><span>Belajar</span></a>
      <a href="#/tebak" data-nav="tebak"><i>🎯</i><span>Tebak</span></a>
    </nav>
  </header>
  <main id="view"></main>`;
const main = document.getElementById('view');

const viewer = new Viewer();
let cleanup = null;

function parse() {
  const [path, query = ''] = (location.hash.slice(1) || '/').split('?');
  const [, page = '', arg = ''] = path.split('/');
  return { page, arg, query };
}

function route() {
  cleanup?.();
  cleanup = null;
  viewer.unmount();

  const { page, arg, query } = parse();
  const root = document.createElement('div');
  root.className = 'view';
  main.replaceChildren(root);
  window.scrollTo(0, 0);

  const ctx = { viewer, query };
  let nav = 'home';
  if (page === 'belajar') {
    nav = 'belajar';
    cleanup = arg ? learnDetailView(root, ctx, arg) : learnListView(root, ctx);
  } else if (page === 'tebak') {
    nav = 'tebak';
    cleanup = quizView(root, ctx);
  } else {
    cleanup = homeView(root, ctx);
  }
  document.body.dataset.page = nav;
  document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('on', a.dataset.nav === nav));
}

window.addEventListener('hashchange', route);
route();
