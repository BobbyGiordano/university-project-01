<template>
  <div>
    <!-- Mobile Top Header (Android & Smartphone view) -->
    <header class="md:hidden sticky top-0 z-40 bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 h-14 px-4 flex items-center justify-between no-print">
      <div class="flex items-center space-x-3">
        <button
          v-if="auth.isAuthenticated"
          @click="isMobileOpen = true"
          type="button"
          class="p-2 -ml-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 focus:outline-none"
          aria-label="Buka Menu"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        <router-link to="/pick-list" class="flex items-center space-x-2">
          <div class="w-6 h-6 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-black text-[10px]">
            HX
          </div>
          <span class="font-bold text-xs tracking-wider uppercase text-zinc-900 dark:text-zinc-100">
            HEX TITANIUM
          </span>
        </router-link>
      </div>

      <div class="flex items-center space-x-1">
        <ThemeToggle />
      </div>
    </header>

    <!-- Mobile Drawer Backdrop Overlay (Android view) -->
    <div
      v-if="isMobileOpen"
      @click="isMobileOpen = false"
      class="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
    ></div>

    <!-- Sidebar Container (Desktop: fixed sticky sidebar | Mobile: slide-over drawer) -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#121215] border-r border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-30 md:h-screen md:sticky md:top-0 no-print"
      :class="[isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0']"
    >
      <!-- Top Branding & Navigation -->
      <div class="p-5 flex-1 overflow-y-auto">
        <!-- Logo & Close button on Mobile -->
        <div class="flex items-center justify-between pb-6 mb-2 border-b border-zinc-100 dark:border-zinc-800/80">
          <router-link to="/pick-list" class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-black text-xs tracking-tighter shadow-sm">
              HX
            </div>
            <div>
              <span class="font-bold text-xs tracking-wider uppercase text-zinc-900 dark:text-zinc-100 block leading-tight">
                HEX TITANIUM
              </span>
              <span class="text-[9px] font-mono uppercase text-zinc-400">
                LAN OPERATIONS
              </span>
            </div>
          </router-link>

          <!-- Mobile Close Button -->
          <button
            @click="isMobileOpen = false"
            class="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Navigation Links (Minimalist, Professional) -->
        <nav v-if="auth.isAuthenticated" class="space-y-1">
          <router-link
            to="/pick-list"
            @click="isMobileOpen = false"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
            :class="[$route.path.startsWith('/pick-list') ? 'bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-white font-semibold shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850']"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
            </svg>
            <span>Ambil Baut</span>
          </router-link>

          <router-link
            to="/dashboard"
            @click="isMobileOpen = false"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
            :class="[$route.path === '/dashboard' ? 'bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-white font-semibold shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850']"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
            <span>Dashboard</span>
          </router-link>

          <router-link
            to="/motorcycles"
            @click="isMobileOpen = false"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
            :class="[$route.path.startsWith('/motorcycles') ? 'bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-white font-semibold shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850']"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <span>Tipe Motor</span>
          </router-link>

          <router-link
            to="/bolt-specs"
            @click="isMobileOpen = false"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
            :class="[$route.path === '/bolt-specs' || $route.path === '/positions' ? 'bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-white font-semibold shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850']"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <circle cx="12" cy="12" r="3" stroke-width="2"></circle>
            </svg>
            <span>Master Baut</span>
          </router-link>

          <router-link
            to="/packages"
            @click="isMobileOpen = false"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
            :class="[$route.path === '/packages' ? 'bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-white font-semibold shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850']"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            <span>Bundling</span>
          </router-link>

          <router-link
            v-if="auth.isAdmin"
            to="/admin/import"
            @click="isMobileOpen = false"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
            :class="[$route.path.startsWith('/admin') ? 'bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-white font-semibold shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850']"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
            </svg>
            <span>Admin Tools</span>
          </router-link>

          <router-link
            to="/help/manual"
            @click="isMobileOpen = false"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
            :class="[$route.path === '/help/manual' ? 'bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-white font-semibold shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850']"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <span>Buku Panduan / SOP</span>
          </router-link>
        </nav>
      </div>

      <!-- Bottom User Profile & Controls -->
      <div v-if="auth.isAuthenticated" class="p-4 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-[#0e0e11]">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2.5 min-w-0">
            <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <div class="min-w-0">
              <p class="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {{ auth.user?.name }}
              </p>
              <p class="text-[10px] font-mono text-zinc-400 uppercase">
                {{ auth.user?.role }}
              </p>
            </div>
          </div>

          <ThemeToggle />
        </div>

        <button
          @click="handleLogout"
          type="button"
          class="w-full py-2 px-3 text-xs font-medium text-zinc-500 hover:text-rose-500 dark:text-zinc-400 dark:hover:text-rose-400 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import ThemeToggle from './ThemeToggle.vue';

const auth = useAuthStore();
const router = useRouter();
const isMobileOpen = ref(false);

const handleLogout = () => {
  isMobileOpen.value = false;
  auth.logout();
  router.push('/login');
};
</script>

