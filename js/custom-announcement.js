(function () {
  const DATA_URL = '/announcement-data.json';
  const FEATURED_ACHIEVEMENT = {
    badge: '科研成果',
    title: '[AAAI-2026] 细粒度运动生成 FineXtrol',
    link: 'https://ojs.aaai.org/index.php/AAAI/article/view/37845'
  };


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

  function getWeatherEmoji(description) {
    const text = String(description || '').toLowerCase();
    if (/thunder|storm/.test(text)) return '⛈️';
    if (/snow|sleet|ice/.test(text)) return '❄️';
    if (/rain|drizzle|shower/.test(text)) return '🌦️';
    if (/fog|mist|haze/.test(text)) return '🌫️';
    if (/wind|breezy|gust/.test(text)) return '🌬️';
    if (/cloud|overcast/.test(text)) return '☁️';
    if (/sun|clear/.test(text)) return '☀️';
    return '🌤️';
  }

  function buildWeatherMeta(weather) {
    const items = [];
    if (weather.feelsLikeC) items.push(`<span class="auto-announcement__pill">体感 ${escapeHtml(weather.feelsLikeC)}°C</span>`);
    if (weather.humidity) items.push(`<span class="auto-announcement__pill">湿度 ${escapeHtml(weather.humidity)}%</span>`);
    if (!items.length) return '';
    return `<div class="auto-announcement__weather-meta">${items.join('')}</div>`;
  }

  function buildHeadlineList(items) {
    if (!Array.isArray(items) || !items.length) {
      return '<div class="auto-announcement__empty">今日头条暂时不可用</div>';
    }

    return `
      <ol class="auto-announcement__list">
        ${items
          .map((item, index) => {
            const title = escapeHtml(item.title);
            const link = escapeHtml(item.link || '#');
            return `
              <li class="auto-announcement__item">
                <span class="auto-announcement__item-index">${index + 1}</span>
                <a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a>
              </li>
            `;
          })
          .join('')}
      </ol>
    `;
  }

  function render(el, data) {
    const weather = data.weather;
    const weatherHtml = weather
      ? `
        <section class="auto-announcement__panel auto-announcement__panel--weather">
          <div class="auto-announcement__panel-head">
            <span class="auto-announcement__badge">${escapeHtml(data.labels?.weather || '天气')}</span>
            <span class="auto-announcement__weather-emoji" aria-hidden="true">${getWeatherEmoji(weather.description)}</span>
          </div>
          <div class="auto-announcement__weather-main">
            <span class="auto-announcement__weather-city">${escapeHtml(weather.city)}</span>
            <span class="auto-announcement__weather-temp">${escapeHtml(weather.tempC)}°C</span>
          </div>
          <div class="auto-announcement__weather-text">${escapeHtml(weather.description)}</div>
          ${buildWeatherMeta(weather)}
        </section>
      `
      : '';

    const featuredHtml = `
      <a class="auto-announcement__panel auto-announcement__panel--featured auto-announcement__featured" href="${escapeHtml(FEATURED_ACHIEVEMENT.link)}" target="_blank" rel="noopener noreferrer">
        <div class="auto-announcement__panel-head">
          <span class="auto-announcement__badge auto-announcement__badge--featured">${escapeHtml(FEATURED_ACHIEVEMENT.badge)}</span>
        </div>
        <div class="auto-announcement__featured-title">${escapeHtml(FEATURED_ACHIEVEMENT.title)}</div>
      </a>
    `;

    el.innerHTML = `
      <div class="auto-announcement__inner">
        ${weatherHtml}
        ${featuredHtml}
        <section class="auto-announcement__panel auto-announcement__panel--headlines">
          <div class="auto-announcement__section-title-row">
            <div class="auto-announcement__section-title">${escapeHtml(data.labels?.headlines || '今日摘要')}</div>
          </div>
          ${buildHeadlineList(data.headlines)}
        </section>
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
