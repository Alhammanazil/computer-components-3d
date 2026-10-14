import { CATEGORIES, COMPONENTS, INTRO } from '../data.js';
import { stageHTML, mountStage } from './stage.js';

export function homeView(root, { viewer }) {
  root.innerHTML = `
    <section class="hero">
      <div class="hero-text">
        <span class="badge">Belajar interaktif · 3D</span>
        <h1><em>Komponenku</em>, teman kenalan dengan isi komputermu!</h1>
        <p>Bongkar, putar, dan zoom ${COMPONENTS.length} komponen komputer dalam tampilan 3D, lalu uji seberapa kenal kamu dengan komponenmu lewat kuis tebak komponen.</p>
        <div class="cta">
          <a class="btn btn-primary" href="#/belajar">📘 Kenali Komponen</a>
          <a class="btn btn-ghost" href="#/tebak">🎯 Tebak Komponen</a>
        </div>
      </div>
      <div class="hero-stage">${stageHTML({ tools: false })}</div>
    </section>

    <section class="intro">
      <h2>${INTRO.title}</h2>
      <p>${INTRO.text}</p>
      <div class="cat-grid">
        ${CATEGORIES.map((c) => `
          <a class="cat-card" href="#/belajar?kategori=${c.id}" style="--c:${c.color}">
            <span class="cat-ico">${c.icon}</span>
            <strong>${c.name}</strong>
            <small>${c.blurb}</small>
          </a>`).join('')}
      </div>
    </section>`;

  mountStage(root, viewer);
  viewer.setPinsVisible(false);
  viewer.setAutoRotate(true);
  viewer.setModel('motherboard');
}
