<template>
  <div class="min-h-[calc(100vh-6rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-6 bg-white dark:bg-card-dark p-8 sm:p-10 rounded-3xl shadow-soft border border-slate-100 dark:border-slate-800/80 transition-all">
      <div class="text-center">
        <div class="mx-auto w-12 h-12 rounded-2xl bg-slate-900 dark:bg-sky-500 text-white flex items-center justify-center font-black text-lg shadow-soft-sm">
          Hx
        </div>
        <h2 class="mt-4 text-xl font-black tracking-tight text-slate-900 dark:text-white">
          Hex Titanium Local System
        </h2>
        <p class="mt-1 text-xs text-slate-400">
          Masuk ke basis data spesifikasi baut sepeda motor
        </p>
      </div>

      <!-- Quick Credentials Pill for Shop Staff -->
      <div class="bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 text-[11px] text-slate-600 dark:text-slate-400">
        <p class="font-bold text-slate-700 dark:text-slate-300 mb-1">Akses Cepat Gerai:</p>
        <div class="flex justify-between font-mono">
          <button @click="fillLogin('staff', 'staff123')" type="button" class="text-sky-600 dark:text-sky-400 hover:underline">
            Staf: staff / staff123
          </button>
          <button @click="fillLogin('admin', 'admin123')" type="button" class="text-sky-600 dark:text-sky-400 hover:underline">
            Admin: admin / admin123
          </button>
        </div>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div v-if="errorMessage" class="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-800/60 rounded-xl text-xs text-rose-600 dark:text-rose-400">
          {{ errorMessage }}
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Username
            </label>
            <input
              v-model="username"
              type="text"
              required
              class="w-full px-3.5 py-2.5 bg-slate-50/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              placeholder="Contoh: staff"
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Password
            </label>
            <input
              v-model="password"
              type="password"
              required
              class="w-full px-3.5 py-2.5 bg-slate-50/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-sky-500 dark:hover:bg-sky-600 shadow-soft-sm transition-all cursor-pointer disabled:opacity-50"
        >
          <span v-if="isLoading">Memproses...</span>
          <span v-else>Masuk ke Sistem</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const fillLogin = (u, p) => {
  username.value = u;
  password.value = p;
};

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
