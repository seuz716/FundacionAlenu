/**
 * Fundación ALENU - Theme Toggle
 * Vanilla JS - Sin dependencias
 */

(() => {
  'use strict';

  // Constantes
  const THEME_KEY = 'theme-preference';
  const DARK_CLASS = 'dark-theme';

  // Detectar preferencia guardada o del sistema
  const getStoredTheme = () => localStorage.getItem(THEME_KEY);
  const getSystemPreference = () => 
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  // Aplicar tema
  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    if (theme === 'dark') {
      document.body.classList.add(DARK_CLASS);
    } else {
      document.body.classList.remove(DARK_CLASS);
    }
  };

  // Inicializar tema al cargar
  const initTheme = () => {
    const savedTheme = getStoredTheme();
    const theme = savedTheme || getSystemPreference();
    applyTheme(theme);
  };

  // Toggle manual
  const setupToggle = () => {
    const toggleBtn = document.getElementById('theme-toggle');
    
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.dataset.theme;
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      applyTheme(nextTheme);
      localStorage.setItem(THEME_KEY, nextTheme);
      
      // Actualizar atributo aria-pressed para accesibilidad
      toggleBtn.setAttribute('aria-pressed', nextTheme === 'dark');
    });

    // Estado inicial del botón
    const initialTheme = getStoredTheme() || getSystemPreference();
    toggleBtn.setAttribute('aria-pressed', initialTheme === 'dark' ? 'true' : 'false');
  };

  // Escuchar cambios en la preferencia del sistema (solo si no hay guardado)
  const watchSystemPreference = () => {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!getStoredTheme()) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
  };

  // Inicializar todo
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupToggle();
    watchSystemPreference();
  });
})();