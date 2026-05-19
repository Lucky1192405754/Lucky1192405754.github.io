(function () {
  function shuffleCopy(items) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function patchTypedSubtitle(target) {
    if (!target || target.__subtitleRandomPatched) return target;
    if (typeof target.init !== 'function') return target;

    const originalInit = target.init;
    target.init = function (strings) {
      const randomized = Array.isArray(strings) ? shuffleCopy(strings) : strings;
      return originalInit.call(this, randomized);
    };
    target.__subtitleRandomPatched = true;
    return target;
  }

  if (window.typedJSFn) {
    patchTypedSubtitle(window.typedJSFn);
    return;
  }

  let storedValue;
  Object.defineProperty(window, 'typedJSFn', {
    configurable: true,
    enumerable: true,
    get() {
      return storedValue;
    },
    set(value) {
      storedValue = patchTypedSubtitle(value);
      delete window.typedJSFn;
      window.typedJSFn = storedValue;
    }
  });
})();
