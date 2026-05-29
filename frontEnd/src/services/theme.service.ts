export function syncSystemTheme(): void {
  const htmlNode = document.documentElement;

  const updateTheme = () => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      htmlNode.classList.add("dark");
    } else {
      htmlNode.classList.remove("dark");
    }
  };

  updateTheme();
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", updateTheme);
}

export const useDarkMode = syncSystemTheme;
