(function () {
  const STORAGE_ENABLED = 'keming-bgm-enabled';
  const STORAGE_TRACK = 'keming-bgm-track';
  const STORAGE_POSITION = 'keming-bgm-position';
  const AUDIO_ID = 'site-bgm-audio';
  const FLOAT_ID = 'site-bgm-floating';
  const PLAYLIST = [
    { title: 'Windy Hill', src: encodeURI('/music/windy_hill.mp3') },
    { title: '穿越时空的思念', src: encodeURI('/music/穿越时空的思念.mp3') },
    { title: '飞向遥远的天空', src: encodeURI('/music/飞向遥远的天空.mp3') }
  ];

  let audio;
  let eventsBound = false;
  let viewportEventsBound = false;
  let dragState = null;
  let suppressNextActionClick = false;

  function normalizeIndex(value) {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed < 0 || parsed >= PLAYLIST.length) return 0;
    return parsed;
  }

  function getSelectedIndex() {
    return normalizeIndex(localStorage.getItem(STORAGE_TRACK));
  }

  function setSelectedIndex(index) {
    localStorage.setItem(STORAGE_TRACK, String(normalizeIndex(index)));
  }

  function isEnabled() {
    return localStorage.getItem(STORAGE_ENABLED) === '1';
  }

  function setEnabled(enabled) {
    localStorage.setItem(STORAGE_ENABLED, enabled ? '1' : '0');
  }

  function getCurrentTrack() {
    return PLAYLIST[getSelectedIndex()];
  }

  function getWidget() {
    return document.getElementById(FLOAT_ID);
  }

  function isPlaying() {
    return !!(audio && !audio.paused && !audio.ended && isEnabled());
  }

  function ensureAudio() {
    if (audio && document.body.contains(audio)) return audio;

    audio = document.getElementById(AUDIO_ID);
    if (!audio) {
      audio = document.createElement('audio');
      audio.id = AUDIO_ID;
      audio.loop = true;
      audio.preload = 'auto';
      audio.hidden = true;
      audio.volume = 0.72;
      document.body.appendChild(audio);
      audio.addEventListener('play', function () {
        updateUi('背景音乐播放中：' + getCurrentTrack().title);
      });
      audio.addEventListener('pause', function () {
        updateUi(isEnabled() ? '背景音乐已暂停' : '背景音乐未开启');
      });
    }

    syncTrack(false);
    return audio;
  }

  function syncTrack(resetTime) {
    const player = audio || document.getElementById(AUDIO_ID);
    if (!player) return;

    const index = getSelectedIndex();
    if (player.dataset.trackIndex === String(index) && player.src) return;

    player.src = getCurrentTrack().src;
    player.dataset.trackIndex = String(index);
    player.load();
    if (resetTime) player.currentTime = 0;
  }

  function readStoredPosition() {
    try {
      const raw = localStorage.getItem(STORAGE_POSITION);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (typeof parsed.left !== 'number' || typeof parsed.top !== 'number') return null;
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function persistWidgetPosition(position) {
    localStorage.setItem(STORAGE_POSITION, JSON.stringify({
      left: Math.round(position.left),
      top: Math.round(position.top)
    }));
  }

  function clampPosition(position) {
    const widget = getWidget();
    const width = widget ? widget.offsetWidth : 64;
    const height = widget ? widget.offsetHeight : 64;
    const safe = 12;

    return {
      left: Math.min(Math.max(safe, position.left), Math.max(safe, window.innerWidth - width - safe)),
      top: Math.min(Math.max(safe, position.top), Math.max(safe, window.innerHeight - height - safe))
    };
  }

  function setWidgetSide(widget, left) {
    if (!widget) return;
    widget.classList.toggle('is-left-side', left < window.innerWidth / 2);
  }

  function applyWidgetPosition(position, persist) {
    const widget = getWidget();
    if (!widget || !position) return;

    const nextPosition = clampPosition(position);
    widget.style.left = nextPosition.left + 'px';
    widget.style.top = nextPosition.top + 'px';
    widget.style.right = 'auto';
    widget.style.bottom = 'auto';
    setWidgetSide(widget, nextPosition.left);

    if (persist) persistWidgetPosition(nextPosition);
  }

  function getDefaultPosition() {
    const marginRight = window.matchMedia('(max-width: 768px)').matches ? 16 : 24;
    const marginBottom = window.matchMedia('(max-width: 768px)').matches ? 96 : 132;
    const widget = getWidget();
    const size = widget ? widget.offsetWidth : 64;

    return {
      left: window.innerWidth - size - marginRight,
      top: window.innerHeight - size - marginBottom
    };
  }

  function syncWidgetPosition() {
    applyWidgetPosition(readStoredPosition() || getDefaultPosition(), false);
  }

  function bindWidgetDrag() {
    const widget = getWidget();
    if (!widget || widget.dataset.dragBound === '1') return;
    widget.dataset.dragBound = '1';

    widget.addEventListener('pointerdown', function (event) {
      if (event.button !== 0) return;
      // 排除上一首/下一首按钮，但允许 toggle 按钮参与拖动判断
      if (event.target.closest('[data-bgm-action="prev"], [data-bgm-action="next"]')) return;

      const rect = widget.getBoundingClientRect();
      const toggleBtn = event.target.closest('[data-bgm-action="toggle"]');

      dragState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startLeft: rect.left,
        startTop: rect.top,
        moved: false,
        isOnToggle: !!toggleBtn
      };

      widget.setPointerCapture(event.pointerId);
    });

    widget.addEventListener('pointermove', function (event) {
      if (!dragState || event.pointerId !== dragState.pointerId) return;

      const deltaX = event.clientX - dragState.startX;
      const deltaY = event.clientY - dragState.startY;

      if (!dragState.moved && Math.hypot(deltaX, deltaY) > 6) {
        dragState.moved = true;
        widget.classList.add('is-dragging');
      }

      if (!dragState.moved) return;

      event.preventDefault();
      applyWidgetPosition({
        left: dragState.startLeft + deltaX,
        top: dragState.startTop + deltaY
      }, false);
    });

    function finishDrag(event) {
      if (!dragState || event.pointerId !== dragState.pointerId) return;

      const moved = dragState.moved;
      const isOnToggle = dragState.isOnToggle;
      widget.classList.remove('is-dragging');

      if (moved) {
        suppressNextActionClick = true;
        const rect = widget.getBoundingClientRect();
        applyWidgetPosition({ left: rect.left, top: rect.top }, true);
      } else if (isOnToggle) {
        // 没有移动且点击的是 toggle 按钮，手动触发播放/暂停
        suppressNextActionClick = true;
        toggleCurrent();
      }

      if (widget.hasPointerCapture(event.pointerId)) {
        widget.releasePointerCapture(event.pointerId);
      }

      dragState = null;
    }

    widget.addEventListener('pointerup', finishDrag);
    widget.addEventListener('pointercancel', finishDrag);
  }

  function ensureFloatingControl() {
    if (document.getElementById(FLOAT_ID)) return;

    const widget = document.createElement('div');
    widget.id = FLOAT_ID;
    widget.className = 'bgm-floating';
    widget.innerHTML = [
      '<div class="bgm-floating__details">',
      '  <div class="bgm-floating__meta">',
      '    <span class="bgm-floating__label" data-bgm-toggle-label>背景音乐已关</span>',
      '    <strong class="bgm-floating__track" data-bgm-track-name>Windy Hill</strong>',
      '  </div>',
      '  <div class="bgm-floating__actions">',
      '    <button class="bgm-floating__sub" type="button" data-bgm-action="prev" title="上一首" aria-label="上一首"><i class="fas fa-backward-step"></i></button>',
      '    <button class="bgm-floating__sub" type="button" data-bgm-action="next" title="下一首" aria-label="下一首"><i class="fas fa-forward-step"></i></button>',
      '  </div>',
      '</div>',
      '<button class="bgm-floating__toggle" type="button" data-bgm-action="toggle" title="开启背景音乐" aria-label="开启背景音乐">',
      '  <i class="fas fa-music" data-bgm-toggle-icon></i>',
      '</button>'
    ].join('');
    document.body.appendChild(widget);
  }

  function updateToggleVisual() {
    const active = isPlaying();
    const label = active ? '音乐播放中' : '背景音乐已关';
    const title = active ? '关闭背景音乐' : '开启背景音乐';

    document.querySelectorAll('[data-bgm-toggle-label]').forEach(function (el) {
      el.textContent = label;
    });

    document.querySelectorAll('[data-bgm-toggle-icon]').forEach(function (el) {
      el.className = active ? 'fas fa-pause' : 'fas fa-music';
    });

    document.querySelectorAll('[data-bgm-action="toggle"]').forEach(function (el) {
      el.setAttribute('title', title);
      el.setAttribute('aria-label', title);
      el.setAttribute('aria-pressed', active ? 'true' : 'false');
      el.classList.toggle('is-playing', active);
    });

    const widget = getWidget();
    if (widget) widget.classList.toggle('is-playing', active);
  }

  function updateUi(message) {
    const track = getCurrentTrack();

    document.querySelectorAll('[data-bgm-track-name]').forEach(function (el) {
      el.textContent = track.title;
    });

    document.querySelectorAll('[data-bgm-status]').forEach(function (el) {
      el.textContent = message || (isEnabled() ? '背景音乐待播放：' + track.title : '背景音乐默认关闭，点击右下角悬浮音乐按钮即可开启。');
    });

    document.querySelectorAll('[data-bgm-track]').forEach(function (el) {
      el.classList.toggle('is-active', Number(el.dataset.bgmTrack) === getSelectedIndex());
    });

    updateToggleVisual();
  }

  function playCurrent() {
    const player = ensureAudio();
    syncTrack(false);
    setEnabled(true);
    return player.play().then(function () {
      updateUi('背景音乐播放中：' + getCurrentTrack().title);
    }).catch(function () {
      updateUi('浏览器拦截了自动播放，请再点一次右下角音乐按钮。');
    });
  }

  function pauseCurrent() {
    const player = ensureAudio();
    player.pause();
    setEnabled(false);
    updateUi('背景音乐已关闭');
  }

  function toggleCurrent() {
    if (isPlaying()) {
      pauseCurrent();
      return;
    }
    playCurrent();
  }

  function switchTrack(index, shouldPlay) {
    setSelectedIndex(index);
    const player = ensureAudio();
    player.dataset.trackIndex = '';
    syncTrack(true);

    if (shouldPlay || isEnabled()) {
      playCurrent();
      return;
    }

    updateUi('已切换曲目：' + getCurrentTrack().title);
  }

  function nextTrack() {
    switchTrack((getSelectedIndex() + 1) % PLAYLIST.length, true);
  }

  function prevTrack() {
    switchTrack((getSelectedIndex() - 1 + PLAYLIST.length) % PLAYLIST.length, true);
  }

  function bindUiActions() {
    if (eventsBound) return;
    eventsBound = true;

    document.addEventListener('click', function (event) {
      if (suppressNextActionClick) {
        suppressNextActionClick = false;
        if (event.target.closest('#' + FLOAT_ID)) {
          event.preventDefault();
          return;
        }
      }

      const actionEl = event.target.closest('[data-bgm-action]');
      if (actionEl) {
        const action = actionEl.dataset.bgmAction;
        if (action === 'toggle') toggleCurrent();
        if (action === 'play') playCurrent();
        if (action === 'pause') pauseCurrent();
        if (action === 'prev') prevTrack();
        if (action === 'next') nextTrack();
      }

      const trackEl = event.target.closest('[data-bgm-track]');
      if (trackEl) {
        switchTrack(Number(trackEl.dataset.bgmTrack), true);
      }
    });
  }

  function bindViewportEvents() {
    if (viewportEventsBound) return;
    viewportEventsBound = true;

    window.addEventListener('resize', function () {
      syncWidgetPosition();
    });
  }

  function maybeAutoplay() {
    ensureAudio();
    if (!isEnabled()) {
      updateUi('背景音乐默认关闭，点击右下角悬浮音乐按钮即可开启。');
      return;
    }

    playCurrent();
  }

  function init() {
    ensureFloatingControl();
    bindWidgetDrag();
    bindViewportEvents();
    ensureAudio();
    syncWidgetPosition();
    updateUi();
    maybeAutoplay();
  }

  bindUiActions();
  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('pjax:complete', init);
  window.KemingBgm = {
    play: playCurrent,
    pause: pauseCurrent,
    toggle: toggleCurrent,
    prev: prevTrack,
    next: nextTrack,
    switchTrack: switchTrack,
    playlist: PLAYLIST.slice()
  };
})();


