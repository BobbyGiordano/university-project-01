<template>
  <header class="bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 sticky top-0 z-40 transition-colors no-print">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-14">
        
        <!-- Brand / Identity (Clean, Technical, Minimalist) -->
        <div class="flex items-center space-x-3">
          <router-link to="/pick-list" class="flex items-center space-x-2.5 group">
            <div class="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-black text-xs tracking-tighter">
              HX
            </div>
            <div class="flex items-center space-x-2">
              <span class="font-bold text-xs tracking-wider uppercase text-zinc-900 dark:text-zinc-100">
                HEX TITANIUM
              </span>
              <span class="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/50">
                LAN
              </span>
            </div>
          </router-link>
        </div>

        <!-- Center Navigation (Professional, No Emojis, Linear-style) -->
        <nav v-if="auth.isAuthenticated" class="hidden md:flex items-center space-x-1">
          <router-link
            to="/pick-list"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            :class="[$route.path.startsWith('/pick-list') ? 'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800/90 font-semibold shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200']"
          >
            Ambil Baut
          </router-link>

          <router-link
            to="/dashboard"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            :class="[$route.path === '/dashboard' ? 'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800/90 font-semibold shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200']"
          >
            Dashboard
          </router-link>

          <router-link
            to="/motorcycles"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            :class="[$route.path.startsWith('/motorcycles') ? 'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800/90 font-semibold shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200']"
          >
            Tipe Motor
          </router-link>

          <router-link
            to="/bolt-specs"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            :class="[$route.path === '/bolt-specs' || $route.path === '/positions' ? 'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800/90 font-semibold shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200']"
          >
            Master Baut
          </router-link>

          <router-link
            to="/packages"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            :class="[$route.path === '/packages' ? 'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800/90 font-semibold shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200']"
          >
            Bundling
          </router-link>

          <router-link
            v-if="auth.isAdmin"
            to="/admin/import"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            :class="[$route.path.startsWith('/admin') ? 'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800/90 font-semibold shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200']"
          >
            Admin
          </router-link>

          <router-link
            to="/help/manual"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            :class="[$route.path === '/help/manual' ? 'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800/90 font-semibold shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200']"
          >
            SOP
          </router-link>
        </nav>

        <!-- Right Side: Minimalist User Info & Controls -->
        <div class="flex items-center space-x-2">
          <ThemeToggle />

          <div v-if="auth.isAuthenticated" class="hidden sm:flex items-center space-x-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
            <div class="flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-zinc-100/70 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span class="text-xs font-medium text-zinc-800 dark:text-zinc-200">{{ auth.user?.name }}</span>
              <span class="text-[9px] font-mono text-zinc-400 uppercase">({{ auth.user?.role }})</span>
            </div>

            <button
              @click="handleLogout"
              class="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              title="Keluar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </button>
          </div>

          <!-- Mobile Menu Trigger -->
          <button
            v-if="auth.isAuthenticated"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            type="button"
            class="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      </div>
    </div>

    <!-- Mobile Drawer -->
    <div v-if="auth.isAuthenticated && isMobileMenuOpen" class="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-xl px-4 py-3 space-y-1">
      <router-link
        @click="isMobileMenuOpen = false"
        to="/pick-list"
        class="block px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
      >
        Ambil Baut
      </router-link>
      <router-link
        @click="isMobileMenuOpen = false"
        to="/dashboard"
        class="block px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
      >
        Dashboard
      </router-link>
      <router-link
        @click="isMobileMenuOpen = false"
        to="/motorcycles"
        class="block px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
      >
        Tipe Motor
      </router-link>
      <router-link
        @click="isMobileMenuOpen = false"
        to="/bolt-specs"
        class="block px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
      >
        Master Baut
      </router-link>
      <router-link
        @click="isMobileMenuOpen = false"
        to="/packages"
        class="block px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
      >
        Bundling
      </router-link>
      <router-link
        v-if="auth.isAdmin"
        @click="isMobileMenuOpen = false"
        to="/admin/import"
        class="block px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
      >
        Admin
      </router-link>
      <router-link
        @click="isMobileMenuOpen = false"
        to="/help/manual"
        class="block px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
      >
        Buku Panduan & SOP
      </router-link>
      <div class="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <span class="text-xs text-zinc-500">{{ auth.user?.name }}</span>
        <button @click="handleLogout" class="text-xs text-rose-500 font-medium">Keluar</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import ThemeToggle from './ThemeToggle.vue';

const auth = useAuthStore();
const router = useRouter();
const isMobileMenuOpen = ref(false);

const handleLogout = () => {
  isMobileMenuOpen.value = false;
  auth.logout();
  router.push('/login');
};
</script>
