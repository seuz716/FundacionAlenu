(function() {
  'use strict';

  const THEME_KEY = 'theme-preference';
  const DARK_CLASS = 'dark-theme';
  const TOGGLE_ID = 'theme-toggle';

  const getStoredTheme = function() { return localStorage.getItem(THEME_KEY); };
  const getSystemPreference = function() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  var toggleBtn = null;

  var updateToggleAria = function(theme) {
    if (!toggleBtn) return;
    var isDark = theme === 'dark';
    toggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    toggleBtn.setAttribute('aria-label', isDark ? 'Desactivar modo oscuro' : 'Activar modo oscuro');
  };

  var applyTheme = function(theme) {
    document.documentElement.dataset.theme = theme;
    if (theme === 'dark') {
      document.body.classList.add(DARK_CLASS);
    } else {
      document.body.classList.remove(DARK_CLASS);
    }
    updateToggleAria(theme);
  };

  var initTheme = function() {
    var savedTheme = getStoredTheme();
    var theme = savedTheme || getSystemPreference();
    applyTheme(theme);
  };

  var setupToggle = function() {
    toggleBtn = document.getElementById(TOGGLE_ID);
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', function() {
      var currentTheme = document.documentElement.dataset.theme;
      var nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      localStorage.setItem(THEME_KEY, nextTheme);
    });

    var initialTheme = getStoredTheme() || getSystemPreference();
    updateToggleAria(initialTheme);
  };

  var watchSystemPreference = function() {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', function(e) {
        if (!getStoredTheme()) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
  };

  initTheme();
  setupToggle();
  watchSystemPreference();
})();
