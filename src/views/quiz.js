import { CATEGORIES, COMPONENTS, catOf } from '../data.js';
import { getThumb } from '../thumbs.js';
import { stageHTML, mountStage } from './stage.js';

const BEST_KEY = 'kk3d-best';
const readBest = () => {
  try { return JSON.parse(localStorage.getItem(BEST_KEY)) || {}; } catch { return {}; }
};
const saveBest = (key, pct) => {
  try {
    const b = readBest();
    if (!(b[key] >= pct)) localStorage.setItem(BEST_KEY, JSON.stringify({ ...b, [key]: pct }));
  } catch { /* penyimpanan tidak tersedia, abaikan */ }
};

const shuffle = (a) => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

/** 3 pengecoh: usahakan sekategori (lebih menantang), sisanya acak. */
function makeOptions(c) {
  const same = shuffle(COMPONENTS.filter((x) => x.id !== c.id && x.cat === c.cat));
  const other = shuffle(COMPONENTS.filter((x) => x.id !== c.id && x.cat !== c.cat));
  const wrong = [...same.slice(0, 2), ...other].slice(0, 3);
  return shuffle([c, ...wrong]);
}

export function quizView(root, ctx) {
  const state = { phase: 'start', count: 10, cat: 'semua' };
  let quiz = null;
  let cleanupKeys = () => {};

  /* ---------------------------------------------------------------- mulai */
  const showStart = () => {
    cleanupKeys();
    ctx.viewer.unmount();
    const best = readBest();
    root.innerHTML = `
      <section class="quiz-start">
        <div class="quiz-start-card">
          <div class="big-emoji">🎯</div>
          <h1>Tebak Komponen</h1>
          <p>Lihat model 3D-nya, putar sesukamu, lalu tebak namanya. Jawab benar untuk mengumpulkan poin!</p>

          <div class="opt-group">
            <label>Jumlah soal</label>
            <div class="seg" data-key="count">
              ${[5, 10, 20].map((n) => `<button class="${state.count === n ? 'on' : ''}" data-v="${n}">${n}</button>`).join('')}
            </div>
          </div>
          <div class="opt-group">
            <label>Kategori</label>
            <div class="seg wrap" data-key="cat">
              <button class="${state.cat === 'semua' ? 'on' : ''}" data-v="semua">Semua</button>
              ${CATEGORIES.map((c) => `<button class="${state.cat === c.id ? 'on' : ''}" data-v="${c.id}">${c.icon} ${c.name}</button>`).join('')}
            </div>
          </div>
          <button class="btn btn-primary btn-lg" data-start>Mulai Kuis ▶</button>
          ${best[`${state.cat}-${state.count}`] != null ? `<p class="best">🏆 Skor terbaik (pengaturan ini): <b>${best[`${state.cat}-${state.count}`]}%</b></p>` : ''}
        </div>
      </section>`;
  };

  root.addEventListener('click', (e) => {
    const seg = e.target.closest('.seg button');
    if (seg && state.phase === 'start') {
      const k = seg.parentElement.dataset.key;
      state[k] = k === 'count' ? +seg.dataset.v : seg.dataset.v;
      showStart();
    } else if (e.target.closest('[data-start]')) {
      start();
    } else if (e.target.closest('[data-again]')) {
      state.phase = 'start';
      showStart();
    }
  });

  /* ---------------------------------------------------------------- bermain */
  const start = () => {
    const pool = COMPONENTS.filter((c) => state.cat === 'semua' || c.cat === state.cat);
    const picked = shuffle(pool).slice(0, Math.min(state.count, pool.length));
    quiz = {
      items: picked.map((c) => ({ c, options: makeOptions(c), answer: null, hinted: false, dropped: [] })),
      i: 0, score: 0, streak: 0, best: 0, key: `${state.cat}-${state.count}`,
    };
    state.phase = 'play';
    showQuestion();
  };

  const showQuestion = () => {
    const { items, i } = quiz;
    const q = items[i];
    root.innerHTML = `
      <div class="quiz">
        <div class="quiz-top">
          <a class="back" href="#/" aria-label="Keluar dari kuis">✕<span> Keluar</span></a>
          <div class="progress"><i style="width:${(i / items.length) * 100}%"></i></div>
          <span class="chip-stat">⭐ <b data-score>${quiz.score}</b></span>
          <span class="chip-stat fire ${quiz.streak >= 2 ? 'on' : ''}">🔥 <b>${quiz.streak}</b></span>
          <span class="counter">${i + 1} / ${items.length}</span>
        </div>
        <div class="quiz-board">
          ${stageHTML({ tools: false })}
          <div class="quiz-side">
            <div class="options">
              ${q.options.map((o, k) => `
                <button class="opt" data-k="${k}"><kbd>${k + 1}</kbd>${o.name}</button>`).join('')}
            </div>
            <button class="btn btn-ghost hint-btn" data-hint>💡 Petunjuk (50:50)</button>
          </div>
        </div>
        <div class="quiz-bar" aria-live="polite">
          <span class="q-text">Apa nama komponen komputer di atas?</span>
        </div>
      </div>`;

    mountStage(root, ctx.viewer);
    ctx.viewer.setPinsVisible(false);
    ctx.viewer.setAutoRotate(true);
    ctx.viewer.setModel(q.c.id);

    const bar = root.querySelector('.quiz-bar');
    const opts = [...root.querySelectorAll('.opt')];
    const hintBtn = root.querySelector('[data-hint]');

    const answer = (k) => {
      if (q.answer !== null) return;
      q.answer = k;
      const ok = q.options[k].id === q.c.id;
      const gain = ok ? (q.hinted ? 5 : 10) : 0;
      quiz.score += gain;
      quiz.streak = ok ? quiz.streak + 1 : 0;
      quiz.best = Math.max(quiz.best, quiz.streak);
      q.gain = gain;
      opts.forEach((b, idx) => {
        b.disabled = true;
        if (q.options[idx].id === q.c.id) b.classList.add('right');
        else if (idx === k) b.classList.add('wrong');
      });
      hintBtn.disabled = true;
      root.querySelector('[data-score]').textContent = quiz.score;
      root.querySelector('.fire b').textContent = quiz.streak;
      root.querySelector('.fire').classList.toggle('on', quiz.streak >= 2);
      const last = i === items.length - 1;
      bar.classList.add(ok ? 'ok' : 'bad');
      bar.innerHTML = `
        <div class="feedback">
          <strong>${ok ? `✅ Benar! +${gain}` : '❌ Belum tepat'}</strong>
          <span>Ini adalah <b>${q.c.name}</b>. ${q.c.job}</span>
        </div>
        <button class="btn btn-primary" data-next>${last ? 'Lihat Hasil' : 'Lanjut'} ▶</button>`;
      bar.querySelector('[data-next]').focus();
      // putar model lebih lambat agar mudah diamati
      ctx.viewer.setAutoRotate(true);
    };

    const next = () => {
      if (q.answer === null) return;
      if (i === items.length - 1) showResult(); else { quiz.i++; showQuestion(); }
    };

    root.querySelector('.options').addEventListener('click', (e) => {
      const b = e.target.closest('.opt');
      if (b && !b.disabled) answer(+b.dataset.k);
    });
    hintBtn.addEventListener('click', () => {
      if (q.hinted || q.answer !== null) return;
      q.hinted = true;
      hintBtn.disabled = true;
      const wrong = shuffle(q.options.map((o, k) => k).filter((k) => q.options[k].id !== q.c.id)).slice(0, 2);
      wrong.forEach((k) => { opts[k].disabled = true; opts[k].classList.add('gone'); });
      const cat = catOf(q.c);
      bar.querySelector('.q-text').innerHTML = `💡 Kategori: <b>${cat.name}</b>. Fungsi: ${q.c.job} <em>(poin separuh)</em>`;
    });
    root.querySelector('.quiz-bar').addEventListener('click', (e) => {
      if (e.target.closest('[data-next]')) next();
    });

    cleanupKeys();
    const onKey = (e) => {
      if (e.key >= '1' && e.key <= '4') {
        const b = opts[+e.key - 1];
        if (b && !b.disabled) answer(+e.key - 1);
      } else if (e.key === 'Enter' && q.answer !== null) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKey);
    cleanupKeys = () => window.removeEventListener('keydown', onKey);
  };

  /* ----------------------------------------------------------------- hasil */
  const showResult = () => {
    cleanupKeys();
    ctx.viewer.unmount();
    state.phase = 'result';
    const { items } = quiz;
    const right = items.filter((q) => q.options[q.answer].id === q.c.id).length;
    const pct = Math.round((right / items.length) * 100);
    const prevBest = readBest()[quiz.key];
    saveBest(quiz.key, pct);
    const msg = pct === 100 ? ['🏆', 'Sempurna! Kamu jagoan komputer!']
      : pct >= 80 ? ['🎉', 'Hebat! Pengetahuanmu sudah bagus.']
        : pct >= 50 ? ['👍', 'Lumayan! Sedikit lagi belajar, pasti makin jago.']
          : ['📚', 'Jangan menyerah! Yuk belajar lagi komponennya.'];
    const wrong = items.filter((q) => q.options[q.answer].id !== q.c.id);

    root.innerHTML = `
      <section class="quiz-start">
        <div class="quiz-start-card result">
          <div class="big-emoji">${msg[0]}</div>
          <h1>${msg[1]}</h1>
          <div class="score-ring" style="--p:${pct}"><b>${pct}%</b><small>${right} dari ${items.length} benar</small></div>
          <div class="stats">
            <div><b>${quiz.score}</b><small>Poin</small></div>
            <div><b>${quiz.best}</b><small>Beruntun terbaik</small></div>
            <div><b>${prevBest != null ? Math.max(prevBest, pct) : pct}%</b><small>Rekor</small></div>
          </div>
          ${wrong.length ? `
          <div class="review">
            <h2>Yang perlu dipelajari lagi</h2>
            ${wrong.map((q) => `
              <a class="review-item" href="#/belajar/${q.c.id}">
                <span class="thumb sm" data-thumb="${q.c.id}"></span>
                <span><strong>${q.c.name}</strong><small>Kamu menjawab: ${q.options[q.answer].name}</small></span>
                <i>Pelajari →</i>
              </a>`).join('')}
          </div>` : '<p class="best">Tidak ada jawaban yang salah. 🎊</p>'}
          <div class="cta">
            <button class="btn btn-primary" data-again>🔁 Main Lagi</button>
            <a class="btn btn-ghost" href="#/belajar">📘 Belajar</a>
          </div>
        </div>
      </section>`;
    root.querySelectorAll('[data-thumb]').forEach((el) => {
      getThumb(el.dataset.thumb).then((url) => {
        if (el.isConnected) el.innerHTML = `<img src="${url}" alt="" />`;
      });
    });
  };

  showStart();
  return () => cleanupKeys();
}
