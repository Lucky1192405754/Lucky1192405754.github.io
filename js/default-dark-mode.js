(function () {
  try {
    var savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      savedTheme = 'dark';
      localStorage.setItem('theme', savedTheme);
    }
    document.documentElement.setAttribute('data-theme', savedTheme === 'light' ? 'light' : 'dark');
  } catch (error) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
