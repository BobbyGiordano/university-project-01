<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-150">
    <!-- Clean Minimalist Sidebar with Android mobile drawer support - only when authenticated & not login -->
    <Sidebar v-if="showSidebar" />

    <!-- Main Content Area -->
    <div
      class="flex-1 flex flex-col min-w-0"
      :class="[showSidebar ? '' : 'justify-center items-center min-h-screen']"
    >
      <main
        :class="[
          showSidebar
            ? 'flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8'
            : 'w-full flex-1 flex items-center justify-center p-4'
        ]"
      >
        <router-view />
      </main>

      <!-- Footer (only shown inside main app shell) -->
      <footer
        v-if="showSidebar"
        class="border-t border-zinc-200/60 dark:border-zinc-900 py-5 text-center text-xs text-zinc-400 dark:text-zinc-600 no-print"
      >
        <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p class="font-medium">
            Hex Titanium &bull; Banguntapan, Bantul, Yogyakarta
          </p>
          <p class="text-[11px] text-zinc-400 dark:text-zinc-600 font-mono">
            Local Shop Operations &bull; Program 1
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from './components/Sidebar.vue';
import { useTheme } from './composables/useTheme';
import { useAuthStore } from './stores/auth';

const route = useRoute();
const auth = useAuthStore();
const { initTheme } = useTheme();

const showSidebar = computed(() => {
  return auth.isAuthenticated && route.name !== 'login';
});

onMounted(() => {
  initTheme();
});
</script>
