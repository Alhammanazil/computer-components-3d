import { WIRES, STANDARDS, PIN_ROLE, LAN_CASES, LAN_TIPS } from '../lan.js';
import { stageHTML, mountStage } from './stage.js';

const swatch = (id) => {
  const w = WIRES[id];
  const bg = w.stripe
    ? `repeating-linear-gradient(135deg, #fff 0 4px, ${w.c} 4px 8px)`
    : w.c;
  return `<i class="sw" style="background:${bg}" title="${w.name}"></i>`;
};

const stdChips = (cur, attr) => Object.entries(STANDARDS).map(([k, s]) =>
  `<button type="button" class="${cur === k ? 'on' : ''}" data-${attr}="${k}">${s.name}</button>`).join('');

function pinTable(std) {
  return STANDARDS[std].order.map((id, i) => `
    <li><b>${i + 1}</b>${swatch(id)}<span>${WIRES[id].name}</span><em>${PIN_ROLE[i]}</em></li>`).join('');
}

/** Garis kawat antara pin ujung 1 dan ujung 2. */
function diagram(a, b) {
  const oa = STANDARDS[a].order;
  const ob = STANDARDS[b].order;
  const y = (i) => 22 + i * 30;
  const lines = oa.map((id, i) => {
    const j = ob.indexOf(id);
    const w = WIRES[id];
    const d = `M60 ${y(i)} C 150 ${y(i)}, 190 ${y(j)}, 280 ${y(j)}`;
    return `<path d="${d}" stroke="${w.c}" stroke-width="7" fill="none" stroke-linecap="round"/>`
      + (w.stripe ? `<path d="${d}" stroke="#fff" stroke-width="7" fill="none" stroke-dasharray="6 6"/>` : '');
  }).join('');
  const pins = [60, 280].map((x) => Array.from({ length: 8 }, (_, i) => `
    <circle cx="${x}" cy="${y(i)}" r="9" fill="#e4f6fd" stroke="#0b7fb8" stroke-width="2"/>
    <text x="${x}" y="${y(i) + 4}" text-anchor="middle" font-size="11" font-weight="800" fill="#0b7fb8">${i + 1}</text>`).join('')).join('');
  return `<svg viewBox="0 0 340 250" role="img" aria-label="Diagram sambungan kawat ujung 1 ke ujung 2">${lines}${pins}</svg>`;
}

function lab(a, b) {
  const straight = a === b;
  const c = LAN_CASES[straight ? 0 : 1];
  return `
    <div class="lab-ends">
      <div><label>Ujung 1</label><div class="seg">${stdChips(a, 'e1')}</div></div>
      <div><label>Ujung 2</label><div class="seg">${stdChips(b, 'e2')}</div></div>
    </div>
    <div class="lab-diagram">${diagram(a, b)}</div>
    <div class="lab-verdict ${straight ? 'ok' : 'x'}">
      <strong>${c.n}</strong><small>${STANDARDS[a].name} ↔ ${STANDARDS[b].name}</small>
      <p>${c.use}</p>
    </div>`;
}

export function lanView(root, ctx) {
  let std = 't568b';
  let e1 = 't568b';
  let e2 = 't568b';

  root.innerHTML = `
    <div class="detail" style="--c:#2ec4b6">
      <div class="detail-top">
        <a class="back" href="#/kabel" aria-label="Kembali ke daftar">←<span> Semua kabel &amp; port</span></a>
        <a class="counter" href="#/kabel/port-rj45">Konektor RJ45 →</a>
      </div>
      <div class="detail-main">
        ${stageHTML({ tools: false })}
        <aside class="panel">
          <span class="tag">🌐 Jaringan</span>
          <h1>Kabel LAN<small>Straight &amp; Crossover · T568A / T568B</small></h1>
          <p class="what">Delapan kawat dalam kabel LAN harus berurutan sesuai standar sebelum dicrimping. Ada dua standar urutan warna: T568A dan T568B.</p>
          <div class="info">
            <div><b>💡 Cara ingat</b><p>Pegang konektor dengan kait di bawah dan lubang kabel menghadap ke arahmu. Pin 1 ada di sisi kiri.</p></div>
          </div>
          <h2>Urutan kawat <small>pilih standar</small></h2>
          <div class="seg" data-std>${stdChips(std, 'std')}</div>
          <ol class="pintable" data-pins>${pinTable(std)}</ol>
        </aside>
      </div>
    </div>

    <section class="lab">
      <h2>Simulator: straight atau crossover?</h2>
      <p class="muted">Pilih standar tiap ujung, lalu lihat jenis kabel yang terbentuk.</p>
      <div data-lab>${lab(e1, e2)}</div>

      <h2>Kapan memakai yang mana?</h2>
      <div class="lab-cases">
        ${LAN_CASES.map((c) => `<div><strong>${c.n}</strong><small>${c.ends}</small><p>${c.use}</p></div>`).join('')}
      </div>

      <h2>Catatan dari lapangan</h2>
      <ul class="lab-tips">${LAN_TIPS.map((t) => `<li>${t}</li>`).join('')}</ul>
    </section>`;

  mountStage(root, ctx.viewer);
  ctx.viewer.setPinsVisible(false);
  ctx.viewer.setAutoRotate(true);
  ctx.viewer.setModel('port-rj45', { variant: std });

  const labEl = root.querySelector('[data-lab]');
  const table = root.querySelector('[data-pins]');
  const seg = root.querySelector('[data-std]');

  root.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.std) {
      std = b.dataset.std;
      seg.innerHTML = stdChips(std, 'std');
      table.innerHTML = pinTable(std);
      ctx.viewer.setModel('port-rj45', { variant: std });
    } else if (b.dataset.e1 || b.dataset.e2) {
      e1 = b.dataset.e1 || e1;
      e2 = b.dataset.e2 || e2;
      labEl.innerHTML = lab(e1, e2);
    }
  });
}
