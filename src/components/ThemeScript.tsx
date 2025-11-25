export function ThemeScript() {
  const codeToRunOnClient = `
    (function() {
      function getThemePreference() {
        if (typeof window !== 'undefined') {
          const persisted = localStorage.getItem('theme');
          if (persisted) {
            return persisted;
          }
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
      }
      const theme = getThemePreference();
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      root.style.colorScheme = theme;
    })();
  `;

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Internal script for theme initialization
      dangerouslySetInnerHTML={{ __html: codeToRunOnClient }}
    />
  );
}
