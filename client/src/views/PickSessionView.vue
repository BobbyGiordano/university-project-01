<template>
  <div class="max-w-4xl mx-auto space-y-5">
    <!-- Back & Print Navigation -->
    <div class="flex items-center justify-between no-print">
      <router-link
        to="/pick-list"
        class="inline-flex items-center text-xs font-medium text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Kembali ke Pemilihan
      </router-link>

      <button
        @click="handlePrint"
        type="button"
        class="px-3.5 py-1.5 bg-white dark:bg-[#121215] hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center space-x-1.5 transition-colors cursor-pointer"
      >
        <svg class="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
        </svg>
        <span>Cetak</span>
      </button>
    </div>

    <!-- Main Card -->
    <div v-if="session" class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 p-5 sm:p-7 shadow-sm transition-colors">
      
      <!-- Session Header -->
      <div class="border-b border-zinc-100 dark:border-zinc-800/80 pb-5">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div class="flex items-center space-x-2 mb-1.5">
              <span class="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700">
                SESI #{{ session.id }}
              </span>
              <span
                class="text-[10px] font-mono px-2 py-0.5 rounded border"
                :class="[session.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-300 border-zinc-700']"
              >
                {{ session.status === 'COMPLETED' ? 'SELESAI LENGKAP' : 'SEDANG DIAMBIL' }}
              </span>
            </div>

            <h1 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {{ session.motorcycleType.displayName }}
            </h1>
            <p v-if="session.package" class="text-xs text-zinc-400 font-mono mt-0.5">
              {{ session.package.name }}
            </p>
          </div>

          <div class="text-left sm:text-right text-xs text-zinc-400 font-mono">
            <p>Staf: <span class="text-zinc-200">{{ session.creator.name }}</span></p>
            <p class="text-[11px] mt-0.5">{{ new Date(session.createdAt).toLocaleDateString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) }}</p>
          </div>
        </div>

        <!-- Minimalist Progress Bar -->
        <div class="mt-5 space-y-1.5">
          <div class="flex justify-between text-xs font-mono">
            <span class="text-zinc-400">
              Progres: {{ session.checkedItems }} / {{ session.totalItems }} Terambil
            </span>
            <span class="text-zinc-200 font-bold">{{ session.progressPercent }}%</span>
          </div>
          <div class="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              class="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-300"
              :style="{ width: `${session.progressPercent}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Checklist Items -->
      <div class="mt-5 space-y-2">
        <div
          v-for="item in session.items"
          :key="item.id"
          @click="toggleItem(item)"
          class="p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between gap-3"
          :class="[
            item.checked
              ? 'bg-zinc-50/50 dark:bg-[#18181c]/40 border-zinc-200/40 dark:border-zinc-800/40 opacity-50'
              : 'bg-white dark:bg-[#18181c] border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700'
          ]"
        >
          <div class="flex items-center space-x-3 min-w-0">
            <!-- Modern Circular Checkbox -->
            <div
              class="w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0"
              :class="[
                item.checked
                  ? 'bg-emerald-500 border-emerald-500 text-black'
                  : 'border-zinc-300 dark:border-zinc-600 bg-transparent'
              ]"
            >
              <svg v-if="item.checked" class="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100" :class="{ 'line-through text-zinc-500': item.checked }">
                  {{ item.boltSpec.code }}
                </span>
                <span class="text-[11px] font-mono text-zinc-400">
                  M{{ Number(item.boltSpec.diameterMm) }} × {{ Number(item.boltSpec.lengthMm) }} mm
                </span>
                <span class="text-[11px] text-zinc-500">
                  {{ item.boltSpec.headType }} &bull; {{ item.boltSpec.finish }}
                </span>
              </div>
              <p class="text-[11px] text-zinc-400 mt-0.5 truncate max-w-md">
                {{ item.positionSummary || 'Seluruh motor' }}
              </p>
            </div>
          </div>

          <div class="shrink-0 text-right">
            <span
              class="inline-block px-2.5 py-1 rounded-md text-xs font-mono font-bold"
              :class="[
                item.checked
                  ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'
                  : 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-700'
              ]"
            >
              {{ item.quantity }} pcs
            </span>
          </div>
        </div>
      </div>

      <!-- Completion Banner -->
      <div v-if="session.status === 'COMPLETED'" class="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center space-x-3 text-xs">
        <span class="text-emerald-400 font-bold">&check;</span>
        <div>
          <h4 class="font-semibold text-emerald-300">Semua Baut Telah Lengkap Diambil</h4>
          <p class="text-emerald-400/80 mt-0.5">
            Daftar baut siap diserahkan kepada teknisi atau pelanggan di gerai Hex Titanium.
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const auth = useAuthStore();
const session = ref(null);

const loadSession = async () => {
  try {
    const res = await fetch(`/api/pick-lists/sessions/${route.params.sessionId}`, {
      headers: auth.authHeaders(),
    });
    if (!res.ok) throw new Error('Sesi tidak ditemukan.');
    session.value = await res.json();
  } catch (err) {
    alert(err.message);
  }
};

const toggleItem = async (item) => {
  const newChecked = !item.checked;
  item.checked = newChecked;

  try {
    const res = await fetch(`/api/pick-lists/sessions/${session.value.id}/items/${item.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...auth.authHeaders(),
      },
      body: JSON.stringify({ checked: newChecked }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    session.value.status = data.sessionStatus;
    session.value.checkedItems = session.value.items.filter((i) => i.checked).length;
    session.value.progressPercent = Math.round((session.value.checkedItems / session.value.totalItems) * 100);
  } catch (err) {
    item.checked = !newChecked;
    alert(err.message);
  }
};

const handlePrint = () => {
  window.print();
};

onMounted(loadSession);
</script>
