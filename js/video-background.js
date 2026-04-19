(function () {
  var VIDEO_ID = 'site-bg-video';
  var VIDEO_SOURCES = [
    '/image/starfield_2k_loop.mp4',
    '/image/starfield_1080p_compat.mp4'
  ];
  var FALLBACK_CLASS = 'video-disabled';

  var FALLBACK_IMAGE = '/image/bg_2.png';
  var resizeTimer = null;


  function shouldUseVideoBackground() {
    return true;
  }



  function removeVideo(bg) {
    if (!bg) return;
    var existing = document.getElementById(VIDEO_ID);
    if (existing) existing.remove();
    bg.classList.add(FALLBACK_CLASS);
    bg.style.backgroundImage = "url('" + FALLBACK_IMAGE + "')";
    bg.style.backgroundColor = '#020617';
  }


  function ensureBackgroundLayout(bg) {
    if (!bg) return;
    bg.style.position = 'fixed';
    bg.style.inset = '0';
    bg.style.overflow = 'hidden';
    bg.style.backgroundPosition = 'center center';
    bg.style.backgroundRepeat = 'no-repeat';
    bg.style.backgroundSize = 'cover';
    bg.style.backgroundColor = '#020617';
  }


  function ensureVideoLayout(video) {
    if (!video) return;
    video.style.position = 'absolute';
    video.style.top = '50%';
    video.style.left = '50%';
    video.style.width = '100vw';
    video.style.height = '100vh';
    video.style.minWidth = '100%';
    video.style.minHeight = '100%';
    video.style.objectFit = 'cover';
    video.style.objectPosition = 'center center';
    video.style.transform = 'translate(-50%, -50%)';
    video.style.pointerEvents = 'none';
  }

  function mountVideo() {
    var bg = document.getElementById('web_bg');
    if (!bg) return;

    ensureBackgroundLayout(bg);

    if (!shouldUseVideoBackground()) {

      removeVideo(bg);
      return;
    }

    bg.classList.remove(FALLBACK_CLASS);
    bg.style.backgroundImage = 'none';

    if (document.getElementById(VIDEO_ID)) return;


    var video = document.createElement('video');
    video.id = VIDEO_ID;
    video.className = 'site-bg-video';
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.poster = '/image/bg_16.png';
    video.setAttribute('aria-hidden', 'true');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('disablePictureInPicture', '');


    ensureVideoLayout(video);

    VIDEO_SOURCES.forEach(function (src) {
      var source = document.createElement('source');
      source.src = src;
      source.type = 'video/mp4';
      video.appendChild(source);
    });


    video.addEventListener('error', function () {
      removeVideo(bg);
    });

    bg.prepend(video);


    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        // 自动播放可能被策略暂时拦截：保留视频节点，不立即降级成静态图
        video.muted = true;
      });
    }

  }

  function initVideoBackground() {
    mountVideo();
  }

  document.addEventListener('DOMContentLoaded', initVideoBackground);
  window.addEventListener('load', initVideoBackground);
  document.addEventListener('pjax:complete', initVideoBackground);
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(initVideoBackground, 160);
  });
})();
