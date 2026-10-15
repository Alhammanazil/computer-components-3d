import { CABLE_GROUPS, CABLE_INTRO, PORTS, groupOf } from '../cables.js';
import { getThumb } from '../thumbs.js';
import { stageHTML, mountStage } from './stage.js';
import { mountParts } from './learn.js';

/* ---------------------------------------------------------------------- daftar */
export function cableListView(root, ctx) {
  const params = new URLSearchParams(ctx.query);
  let active = params.get('kelompok') || 'semua';

  const render = () => {
    const list = PORTS.filter((p) => active === 'semua' || p.group === active);
    root.innerHTML = `
      <section class="page-head">
        <h1>Kabel &amp; Port</h1>
        <p><strong>${CABLE_INTRO.text}</strong></p>
        <p class="muted">Pilih salah satu untuk melihat bentuk konektornya dalam 3D, mengenali versinya, dan tahu kapan dipakai.</p>
      </section>
      <div class="chips" role="tablist">
        <button class="chip ${active === 'semua' ? 'on' : ''}" data-grp="semua">Semua <b>${PORTS.length}</b></button>
        ${CABLE_GROUPS.map((g) => `
          <button class="chip ${active === g.id ? 'on' : ''}" data-grp="${g.id}" style="--c:${g.color}">
            ${g.icon} ${g.name} <b>${PORTS.filter((x) => x.group === g.id).length}</b>
          </button>`).join('')}
      </div>
      <a class="lan-banner" href="#/kabel/lan">
        <span class="big-emoji">🌐</span>
        <span><strong>Praktik kabel LAN: straight &amp; crossover</strong><small>Urutan warna T568A / T568B dan simulator sambungan kawat.</small></span>
        <i>→</i>
      </a>
      <div class="grid">
        ${list.map((p) => {
    const g = groupOf(p);
    return `
          <a class="card" href="#/kabel/${p.id}" style="--c:${g.color}">
            <div class="thumb" data-thumb="${p.id}"><i class="spin"></i></div>
            <div class="card-body">
              <strong>${p.name}</strong>
              <small>${p.alt}</small>
              <span class="tag">${g.icon} ${g.name}</span>
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
    const b = e.target.closest('[data-grp]');
    if (!b) return;
    active = b.dataset.grp;
    render();
  });
  render();
}

/* ---------------------------------------------------------------------- detail */
const listHTML = (l, li) => `
  <section class="vers">
    <h2>${l.title}${l.hint ? `<small>${l.hint}</small>` : ''}</h2>
    <ul>
      ${l.rows.map((r, ri) => `
        <li ${r.variant ? `class="pick" data-l="${li}" data-r="${ri}" tabindex="0" role="button"` : ''}>
          <b>${r.n}</b><em>${r.spec}</em><span>${r.note}</span>
        </li>`).join('')}
    </ul>
  </section>`;

export function cableDetailView(root, ctx, id) {
  const idx = PORTS.findIndex((p) => p.id === id);
  if (idx < 0) {
    location.hash = '#/kabel';
    return;
  }
  const p = PORTS[idx];
  const g = groupOf(p);
  const prev = PORTS[(idx - 1 + PORTS.length) % PORTS.length];
  const next = PORTS[(idx + 1) % PORTS.length];

  root.innerHTML = `
    <div class="detail" style="--c:${g.color}">
      <div class="detail-top">
        <a class="back" href="#/kabel" aria-label="Kembali ke daftar">←<span> Semua kabel &amp; port</span></a>
        <span class="counter">${idx + 1} / ${PORTS.length}</span>
      </div>
      <div class="detail-main">
        ${stageHTML({ card: true })}
        <aside class="panel">
          <span class="tag">${g.icon} ${g.name}</span>
          <h1>${p.name}${p.alt !== p.name ? `<small>${p.alt}</small>` : ''}</h1>
          <div class="tags">${p.tags.map((t) => `<span>${t}</span>`).join('')}</div>
          <p class="what">${p.what}</p>
          <div class="info">
            <div><b>🎯 Fungsi</b><p>${p.job}</p></div>
            <div><b>💡 Perumpamaan</b><p>${p.like}</p></div>
            <div><b>✨ Tahukah kamu?</b><p>${p.fact}</p></div>
          </div>
          ${p.link ? `<a class="btn btn-ghost" href="${p.link.href}">${p.link.label}</a>` : ''}
          ${p.lists.map(listHTML).join('')}
          <h2>Bagian-bagian <small>klik untuk menyorot</small></h2>
          <ol class="parts"></ol>
        </aside>
      </div>
      <nav class="detail-bar">
        <a class="nav-arrow" href="#/kabel/${prev.id}" aria-label="Sebelumnya: ${prev.name}">◀</a>
        <div class="bar-title">${p.name.toUpperCase()}</div>
        <a class="nav-arrow" href="#/kabel/${next.id}" aria-label="Berikutnya: ${next.name}">▶</a>
      </nav>
    </div>`;

  mountStage(root, ctx.viewer);
  ctx.viewer.setAutoRotate(true);
  const firstPick = root.querySelector('.pick');
  const firstVariant = firstPick ? p.lists[+firstPick.dataset.l].rows[+firstPick.dataset.r].variant : undefined;
  ctx.viewer.setModel(p.id, { pins: true, variant: firstVariant });
  firstPick?.classList.add('on');
  const refresh = mountParts(root, ctx.viewer);

  // baris versi yang punya `variant` mengganti bentuk model 3D
  const pick = (li) => {
    const row = p.lists[+li.dataset.l].rows[+li.dataset.r];
    root.querySelectorAll('.pick').forEach((el) => el.classList.toggle('on', el === li));
    ctx.viewer.setModel(p.id, { pins: true, variant: row.variant });
    refresh();
  };
  const panel = root.querySelector('.panel');
  panel.addEventListener('click', (e) => {
    const li = e.target.closest('.pick');
    if (li) pick(li);
  });
  panel.addEventListener('keydown', (e) => {
    const li = e.target.closest('.pick');
    if (li && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      pick(li);
    }
  });

  const onKey = (e) => {
    if (e.target.closest?.('.pick')) return;
    if (e.key === 'ArrowLeft') location.hash = `#/kabel/${prev.id}`;
    if (e.key === 'ArrowRight') location.hash = `#/kabel/${next.id}`;
  };
  window.addEventListener('keydown', onKey);
  return () => {
    window.removeEventListener('keydown', onKey);
    ctx.viewer.onPin = null;
  };
}
