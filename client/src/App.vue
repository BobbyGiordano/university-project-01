<template>
  <div class="min-h-screen flex flex-col bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-150">
    <Navbar />

    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <router-view />
    </main>

    <footer class="border-t border-zinc-200/60 dark:border-zinc-900 py-6 text-center text-xs text-zinc-400 dark:text-zinc-600 no-print">
      <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p class="font-medium">
          Hex Titanium &bull; Banguntapan, Bantul, Yogyakarta
        </p>
        <p class="text-[11px] text-zinc-400 dark:text-zinc-600 font-mono">
          Local Shop Operations System &bull; Program 1
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import { useTheme } from './composables/useTheme';

const { initTheme } = useTheme();

onMounted(() => {
  initTheme();
});
</script>
