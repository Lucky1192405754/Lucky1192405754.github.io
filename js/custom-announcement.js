(function () {
  const DATA_URL = '/announcement-data.json';

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatTime(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  function buildHeadlineList(items) {
    if (!Array.isArray(items) || !items.length) {
      return '<div class="auto-announcement__empty">今日头条暂时不可用</div>';
    }

    return `
      <ol class="auto-announcement__list">
        ${items
          .map((item) => {
            const title = escapeHtml(item.title);
            const link = escapeHtml(item.link || '#');
            return `<li class="auto-announcement__item"><a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a></li>`;
          })
          .join('')}
      </ol>
    `;
  }

  function render(el, data) {
    const weather = data.weather;
    const weatherHtml = weather
      ? `
        <div class="auto-announcement__weather">
          <span class="auto-announcement__badge">${escapeHtml(data.labels?.weather || '天气')}</span>
          <span class="auto-announcement__weather-text">${escapeHtml(weather.city)} ${escapeHtml(weather.tempC)}°C · ${escapeHtml(weather.description)}</span>
        </div>
      `
      : '';

    el.innerHTML = `
      <div class="auto-announcement__inner">
        ${weatherHtml}
        <div class="auto-announcement__section-title">${escapeHtml(data.labels?.headlines || '今日摘要')}</div>
        ${buildHeadlineList(data.headlines)}
        <div class="auto-announcement__meta">更新于 ${escapeHtml(formatTime(data.generatedAt))}</div>
      </div>
    `;
    el.dataset.loaded = 'true';
  }

  async function loadAnnouncement() {
    const el = document.getElementById('auto-announcement');
    if (!el || el.dataset.loaded === 'true') return;

    try {
      const response = await fetch(DATA_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      render(el, data);
    } catch (error) {
      el.innerHTML = '<div class="auto-announcement__empty">今日摘要暂时不可用</div>';
      console.warn('[announcement] 公告摘要加载失败：', error);
    }
  }

  document.addEventListener('DOMContentLoaded', loadAnnouncement);
  document.addEventListener('pjax:complete', loadAnnouncement);
})();
