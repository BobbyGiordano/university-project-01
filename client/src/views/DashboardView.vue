<template>
  <div class="space-y-6">
    <!-- Top Welcome Card -->
    <div class="bg-white dark:bg-[#121215] rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm transition-colors">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center space-x-2 mb-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Hex Titanium Operations
            </span>
          </div>
          <h1 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Selamat Datang, {{ auth.user?.name }}
          </h1>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Sistem spesifikasi baut motor lokal untuk percepatan penyiapan baut dari 120 menit menjadi 5–10 menit.
          </p>
        </div>

        <div class="flex items-center space-x-2">
          <router-link
            to="/pick-list"
            class="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-xs rounded-xl shadow-sm transition-all"
          >
            Buka Pick-List
          </router-link>
          <router-link
            to="/help/manual"
            class="px-3.5 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 transition-all"
          >
            Buku Panduan
          </router-link>
        </div>
      </div>
    </div>

    <!-- Metrics Row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3.5">
      <div class="bg-white dark:bg-[#121215] p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm">
        <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">Tipe Motor</span>
        <p class="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">{{ motorcycles.length }}</p>
        <span class="text-[11px] text-emerald-500 font-medium block mt-0.5">Target min. 20 terpenuhi</span>
      </div>

      <div class="bg-white dark:bg-[#121215] p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm">
        <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">Ukuran Baut</span>
        <p class="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">{{ boltSpecsCount }}</p>
        <span class="text-[11px] text-zinc-400 block mt-0.5">M5, M6, M8, M10 Gr5</span>
      </div>

      <div class="bg-white dark:bg-[#121215] p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm">
        <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">Matriks Kebutuhan</span>
        <p class="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">{{ totalRequirementsCount }}</p>
        <span class="text-[11px] text-zinc-400 block mt-0.5">Titik baut terpetakan</span>
      </div>

      <div class="bg-white dark:bg-[#121215] p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm">
        <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">Sesi Terlaksana</span>
        <p class="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">{{ recentSessions.length }}</p>
        <span class="text-[11px] text-zinc-400 block mt-0.5">Aktivitas penyiapan</span>
      </div>
    </div>

    <!-- 20 Popular Motorcycles Completeness Grid -->
    <div class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 p-5 sm:p-6 shadow-sm transition-colors">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Status Kelengkapan Data 20 Motor Populer
          </h2>
          <p class="text-[11px] text-zinc-400 mt-0.5">
            Kesiapan data spesifikasi per model motor di gerai
          </p>
        </div>

        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari motor..."
          class="px-3 py-1.5 text-xs bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-600 w-full sm:w-52"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          v-for="motor in filteredMotors"
          :key="motor.id"
          class="p-3.5 rounded-xl border transition-all"
          :class="[
            motor._count.requirements >= 5
              ? 'bg-zinc-50/50 dark:bg-[#18181c]/60 border-zinc-200/70 dark:border-zinc-800'
              : 'bg-zinc-50/20 dark:bg-[#18181c]/30 border-dashed border-zinc-200 dark:border-zinc-800/60'
          ]"
        >
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              {{ motor.brand }}
            </span>
            <span
              class="text-[9px] font-mono px-1.5 py-0.5 rounded border"
              :class="[
                motor._count.requirements >= 5
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : motor._count.requirements > 0
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-zinc-800 text-zinc-500 border-zinc-700'
              ]"
            >
              {{ motor._count.requirements >= 5 ? 'LENGKAP' : motor._count.requirements > 0 ? 'SEBAGIAN' : 'KOSONG' }}
            </span>
          </div>

          <h3 class="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
            {{ motor.model }} {{ motor.variant }}
          </h3>
          <p class="text-[11px] text-zinc-400 font-mono">
            {{ motor.yearStart }}{{ motor.yearEnd ? `-${motor.yearEnd}` : '' }}
          </p>

          <div class="mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs">
            <span class="text-[10px] font-mono text-zinc-400">
              {{ motor._count.requirements }} Titik Baut
            </span>
            <router-link
              to="/motorcycles"
              class="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 hover:text-white"
            >
              Kelola &rarr;
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Pick Sessions Table -->
    <div class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 p-5 sm:p-6 shadow-sm transition-colors">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Riwayat Sesi Pengambilan Baut
          </h2>
          <p class="text-[11px] text-zinc-400 mt-0.5">
            Daftar aktivitas penyiapan baut staf
          </p>
        </div>
        <router-link
          to="/pick-list"
          class="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-white"
        >
          + Sesi Baru
        </router-link>
      </div>

      <div v-if="recentSessions.length === 0" class="text-center py-8 text-xs text-zinc-400 font-mono">
        Belum ada riwayat sesi pengambilan.
      </div>

      <div v-else class="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-xs">
        <div
          v-for="s in recentSessions"
          :key="s.id"
          class="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
        >
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-mono text-[10px] text-zinc-400">#{{ s.id }}</span>
              <span class="font-semibold text-zinc-900 dark:text-zinc-100">
                {{ s.motorcycleType.displayName }}
              </span>
              <span
                class="text-[9px] font-mono px-1.5 py-0.5 rounded border"
                :class="[s.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-300 border-zinc-700']"
              >
                {{ s.status }}
              </span>
            </div>
            <p class="text-[11px] text-zinc-400 font-mono mt-0.5">
              Staf: {{ s.creator.name }} &bull; {{ new Date(s.createdAt).toLocaleDateString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) }}
            </p>
          </div>

          <div class="flex items-center space-x-3">
            <div class="text-right">
              <span class="text-[11px] font-mono text-zinc-400">
                {{ s.checkedItems }}/{{ s.totalItems }}
              </span>
              <div class="w-16 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-1">
                <div class="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full" :style="{ width: `${s.progressPercent}%` }"></div>
              </div>
            </div>

            <router-link
              :to="`/pick-list/${s.id}`"
              class="px-2.5 py-1 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-200 transition-colors"
            >
              Lihat
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const motorcycles = ref([]);
const recentSessions = ref([]);
const boltSpecsCount = ref(0);
const searchQuery = ref('');

const filteredMotors = computed(() => {
  if (!searchQuery.value) return motorcycles.value;
  const q = searchQuery.value.toLowerCase();
  return motorcycles.value.filter(
    (m) =>
      m.displayName.toLowerCase().includes(q) ||
      m.brand.toLowerCase().includes(q) ||
      m.model.toLowerCase().includes(q)
  );
});

const totalRequirementsCount = computed(() => {
  return motorcycles.value.reduce((acc, m) => acc + (m._count?.requirements || 0), 0);
});

const loadDashboardData = async () => {
  try {
    const [resMotors, resSessions, resSpecs] = await Promise.all([
      fetch('/api/motorcycles', { headers: auth.authHeaders() }),
      fetch('/api/pick-lists/sessions?limit=5', { headers: auth.authHeaders() }),
      fetch('/api/bolt-specs', { headers: auth.authHeaders() }),
    ]);

    motorcycles.value = await resMotors.json();
    recentSessions.value = await resSessions.json();
    const specs = await resSpecs.json();
    boltSpecsCount.value = specs.length;
  } catch (err) {
    console.error('Error loading dashboard:', err);
  }
};

onMounted(loadDashboardData);
</script>
