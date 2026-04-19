// 等 DOM ready 或者在 <head> 里尽量早地执行
document.addEventListener("DOMContentLoaded", () => {
  if (window.subtitle && Array.isArray(window.subtitle.sub)) {
    // Fisher–Yates Shuffle
    for (let i = window.subtitle.sub.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [window.subtitle.sub[i], window.subtitle.sub[j]] = [
        window.subtitle.sub[j],
        window.subtitle.sub[i],
      ];
    }
  }
});
