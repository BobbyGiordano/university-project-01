import { ref, onMounted } from 'vue';

const isDark = ref(false);

export function useTheme() {
  const initTheme = () => {
    const savedTheme = localStorage.getItem('hextitanium-theme');
    if (savedTheme) {
      isDark.value = savedTheme === 'dark';
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    applyTheme();
  };

  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('hextitanium-theme', isDark.value ? 'dark' : 'light');
  };

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    applyTheme();
  };

  return {
    isDark,
    initTheme,
    toggleTheme,
  };
}

