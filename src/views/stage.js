/**
 * Panggung 3D: area bergrid biru + canvas viewer + tombol bantu.
 * Mengembalikan elemen; panggil `mountStage` setelah elemen masuk ke DOM.
 */
export function stageHTML({ tools = true, hint = true } = {}) {
  return `
    <div class="stage">
      <div class="stage-canvas"></div>
      <div class="pins"></div>
      ${hint ? '<div class="stage-hint"><span>✋</span> Seret untuk memutar 360° · Scroll untuk zoom</div>' : ''}
      ${tools ? `
      <div class="stage-tools">
        <button type="button" data-act="rotate" class="on" title="Putar otomatis" aria-label="Putar otomatis">⟳</button>
        <button type="button" data-act="reset" title="Atur ulang tampilan" aria-label="Atur ulang tampilan">⌖</button>
        <button type="button" data-act="pins" class="on" title="Tampilkan label bagian" aria-label="Tampilkan label bagian" data-pins>🏷️</button>
      </div>` : ''}
    </div>`;
}

export function mountStage(root, viewer) {
  const stage = root.querySelector('.stage');
  viewer.mount(stage.querySelector('.stage-canvas'), stage.querySelector('.pins'));
  const tools = stage.querySelector('.stage-tools');
  const sync = () => {
    tools?.querySelector('[data-act="rotate"]')?.classList.toggle('on', viewer.auto);
    tools?.querySelector('[data-act="pins"]')?.classList.toggle('on', viewer.pinsOn);
  };
  tools?.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.act === 'rotate') viewer.setAutoRotate(!viewer.auto);
    if (b.dataset.act === 'reset') viewer.resetView();
    if (b.dataset.act === 'pins') viewer.setPinsVisible(!viewer.pinsOn);
    sync();
  });
  sync();
  return stage;
}
