import { CATEGORIES, COMPONENTS, INTRO, catOf } from '../data.js';
import { getThumb } from '../thumbs.js';
import { stageHTML, mountStage } from './stage.js';

/* ------------------------------------------------------------- daftar komponen */
export function learnListView(root, ctx) {
  const params = new URLSearchParams(ctx.query);
  let active = params.get('kategori') || 'semua';

  const render = () => {
    const list = COMPONENTS.filter((c) => active === 'semua' || c.cat === active);
    root.innerHTML = `
      <section class="page-head">
        <h1>Belajar Komputer</h1>
        <p><strong>${INTRO.text}</strong></p>
        <p class="muted">Pilih salah satu komponen di bawah untuk melihat model 3D-nya, memutarnya 360°, dan membaca penjelasannya.</p>
      </section>
      <div class="chips" role="tablist">
        <button class="chip ${active === 'semua' ? 'on' : ''}" data-cat="semua">Semua <b>${COMPONENTS.length}</b></button>
        ${CATEGORIES.map((c) => `
          <button class="chip ${active === c.id ? 'on' : ''}" data-cat="${c.id}" style="--c:${c.color}">
            ${c.icon} ${c.name} <b>${COMPONENTS.filter((x) => x.cat === c.id).length}</b>
          </button>`).join('')}
      </div>
      <div class="grid">
        ${list.map((c) => {
    const cat = catOf(c);
    return `
          <a class="card" href="#/belajar/${c.id}" style="--c:${cat.color}">
            <div class="thumb" data-thumb="${c.id}"><i class="spin"></i></div>
            <div class="card-body">
              <strong>${c.name}</strong>
              <small>${c.alt}</small>
              <span class="tag">${cat.icon} ${cat.name}</span>
            </div>
          </a>`;
  }).join('')}
      </div>`;

    root.querySelectorAll('[data-thumb]').forEach((el) => {
      getThumb(el.dataset.thumb).then((url) => {
        if (!el.isConnected) return;
        el.innerHTML = `<img src="${url}" alt="" loading="lazy" />`;
      });
    });
  };

  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    active = b.dataset.cat;
    render();
  });
  render();
}

/* --------------------------------------------------------------------- detail */
export function learnDetailView(root, ctx, id) {
  const idx = COMPONENTS.findIndex((c) => c.id === id);
  if (idx < 0) {
    location.hash = '#/belajar';
    return;
  }
  const c = COMPONENTS[idx];
  const cat = catOf(c);
  const prev = COMPONENTS[(idx - 1 + COMPONENTS.length) % COMPONENTS.length];
  const next = COMPONENTS[(idx + 1) % COMPONENTS.length];

  root.innerHTML = `
    <div class="detail" style="--c:${cat.color}">
      <div class="detail-top">
        <a class="back" href="#/belajar" aria-label="Kembali ke daftar">←<span> Semua komponen</span></a>
        <span class="counter">${idx + 1} / ${COMPONENTS.length}</span>
      </div>
      <div class="detail-main">
        ${stageHTML()}
        <aside class="panel">
          <span class="tag">${cat.icon} ${cat.name}</span>
          <h1>${c.name}${c.alt !== c.name ? `<small>${c.alt}</small>` : ''}</h1>
          <p class="what">${c.what}</p>
          <div class="info">
            <div><b>🎯 Fungsi</b><p>${c.job}</p></div>
            <div><b>💡 Perumpamaan</b><p>${c.like}</p></div>
            <div><b>✨ Tahukah kamu?</b><p>${c.fact}</p></div>
          </div>
          <h2>Bagian-bagian <small>klik untuk menyorot</small></h2>
          <ol class="parts"></ol>
        </aside>
      </div>
      <nav class="detail-bar">
        <a class="nav-arrow" href="#/belajar/${prev.id}" aria-label="Sebelumnya: ${prev.name}">◀</a>
        <div class="bar-title">${c.name.toUpperCase()}</div>
        <a class="nav-arrow" href="#/belajar/${next.id}" aria-label="Berikutnya: ${next.name}">▶</a>
      </nav>
    </div>`;

  mountStage(root, ctx.viewer);
  ctx.viewer.setAutoRotate(true);
  ctx.viewer.setModel(c.id, { pins: true });

  const parts = ctx.viewer.model.parts;
  const ol = root.querySelector('.parts');
  ol.innerHTML = parts.map((p, i) => `
    <li data-i="${i}"><b>${i + 1}</b><div><strong>${p.name}</strong><span>${p.desc}</span></div></li>`).join('');

  const select = (i, scroll) => {
    ctx.viewer.highlightPin(i);
    ol.querySelectorAll('li').forEach((li, k) => li.classList.toggle('on', k === i));
    if (scroll) ol.children[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };
  ol.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (li) select(+li.dataset.i, false);
  });
  ctx.viewer.onPin = (i) => select(i, true);

  const onKey = (e) => {
    if (e.key === 'ArrowLeft') location.hash = `#/belajar/${prev.id}`;
    if (e.key === 'ArrowRight') location.hash = `#/belajar/${next.id}`;
  };
  window.addEventListener('keydown', onKey);
  return () => {
    window.removeEventListener('keydown', onKey);
    ctx.viewer.onPin = null;
  };
}

