(function () {
  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  function resetSubtitleRandomizer() {
    const subtitleEl = document.getElementById('subtitle');
    if (subtitleEl) subtitleEl.dataset.randomized = 'false';
  }

  function randomizeTypedSubtitle() {
    const subtitleEl = document.getElementById('subtitle');
    const instance = window.typed;
    const TypedCtor = window.Typed;

    if (!subtitleEl || subtitleEl.dataset.randomized === 'true') return true;
    if (!instance || !TypedCtor || !Array.isArray(instance.strings) || instance.strings.length <= 1) return false;

    const shuffled = shuffle(instance.strings.slice());
    const options = instance.options || {};

    instance.destroy();
    subtitleEl.textContent = '';
    window.typed = new TypedCtor('#subtitle', {
      strings: shuffled,
      startDelay: options.startDelay ?? 300,
      typeSpeed: options.typeSpeed ?? 150,
      backSpeed: options.backSpeed ?? 50,
      backDelay: options.backDelay ?? 700,
      loop: options.loop !== false,
      smartBackspace: options.smartBackspace ?? true,
      cursorChar: options.cursorChar ?? '|'
    });
    subtitleEl.dataset.randomized = 'true';
    return true;
  }

  function waitAndRandomize(retryCount) {
    if (randomizeTypedSubtitle() || retryCount >= 30) return;
    window.setTimeout(function () {
      waitAndRandomize(retryCount + 1);
    }, 120);
  }

  function init() {
    resetSubtitleRandomizer();
    waitAndRandomize(0);
  }

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('pjax:complete', init);
})();

