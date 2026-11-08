<template>
  <div class="relative w-full max-w-sm sm:max-w-md mx-auto">
    <!-- Theme Toggle at top right -->
    <div class="absolute -top-12 right-0">
      <ThemeToggle />
    </div>

    <!-- Login Card -->
    <div
      class="w-full space-y-6 bg-white dark:bg-[#121215] p-6 sm:p-8 rounded-2xl shadow-xl border border-zinc-200/80 dark:border-zinc-800/90 transition-colors"
    >
      <!-- Brand Header -->
      <div class="text-center">
        <div
          class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold font-mono text-sm tracking-tight shadow-sm"
        >
          HX
        </div>
        <h2 class="mt-4 text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Hex Titanium Local System
        </h2>
        <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Masuk ke basis data spesifikasi baut sepeda motor
        </p>
        <div class="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-[11px] font-mono text-zinc-600 dark:text-zinc-300">
          <span class="w-2 h-2 rounded-full" :class="isBackendOnline ? 'bg-emerald-500' : 'bg-rose-500'"></span>
          <span>Backend Port: <strong class="font-bold text-zinc-900 dark:text-zinc-100">{{ backendPort }}</strong></span>
        </div>
      </div>

      <!-- Login Form -->
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div
          v-if="errorMessage"
          class="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-600 dark:text-rose-400"
        >
          {{ errorMessage }}
        </div>

        <div class="space-y-3.5">
          <div>
            <label class="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
              Username
            </label>
            <input
              v-model="username"
              type="text"
              required
              autocomplete="username"
              class="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
            />
          </div>

          <div>
            <label class="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
              Password
            </label>
            <input
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              class="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
            />
          </div>
        </div>

        <!-- Submit Button with Obsidian Minimalist Hover -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white dark:text-zinc-950 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white shadow-sm transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <svg
            v-if="isLoading"
            class="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span v-if="isLoading">Memproses Masuk...</span>
          <span v-else>Masuk ke Sistem</span>
        </button>
      </form>

      <!-- Footer Info inside Card -->
      <div class="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-center">
        <p class="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
          Hex Titanium &bull; LAN Gerai Offline-Ready
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useSystemInfo } from '../composables/useSystemInfo';
import ThemeToggle from '../components/ThemeToggle.vue';

const router = useRouter();
const auth = useAuthStore();
const { backendPort, isBackendOnline } = useSystemInfo();

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleSubmit = async () => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    await auth.login(username.value, password.value);
    router.push('/pick-list');
  } catch (err) {
    errorMessage.value = err.message || 'Login gagal. Coba lagi.';
  } finally {
    isLoading.value = false;
  }
};
</script>