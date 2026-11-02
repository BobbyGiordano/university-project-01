<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white dark:bg-[#121215] p-5 sm:p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
      <div>
        <div class="flex items-center space-x-2 mb-1">
          <span class="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
          <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Master Baut</span>
        </div>
        <h1 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Spesifikasi & Posisi Baut Titanium
        </h1>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Standarisasi ukuran diameter (M5, M6, M8, M10), panjang baut, dan titik posisi
        </p>
      </div>

      <!-- Segmented Tab Switcher (No Emojis) -->
      <div class="inline-flex p-1 bg-zinc-100 dark:bg-[#18181c] rounded-xl border border-zinc-200 dark:border-zinc-800">
        <button
          @click="activeTab = 'specs'"
          class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer"
          :class="[activeTab === 'specs' ? 'bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 font-semibold shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200']"
        >
          Spesifikasi ({{ specs.length }})
        </button>
        <button
          @click="activeTab = 'positions'"
          class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer"
          :class="[activeTab === 'positions' ? 'bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 font-semibold shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200']"
        >
          Posisi Pasang ({{ positions.length }})
        </button>
      </div>
    </div>

    <!-- TAB 1: BOLT SPECS -->
    <div v-if="activeTab === 'specs'" class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm overflow-hidden transition-colors">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
              <th class="py-3 px-4 font-normal">Kode Baut</th>
              <th class="py-3 px-4 font-normal">Diameter</th>
              <th class="py-3 px-4 font-normal">Panjang</th>
              <th class="py-3 px-4 font-normal">Tipe Kepala</th>
              <th class="py-3 px-4 font-normal">Pitch Drat</th>
              <th class="py-3 px-4 font-normal">Material & Finishing</th>
              <th class="py-3 px-4 font-normal">Catatan Area</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
            <tr v-for="s in specs" :key="s.id" class="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30">
              <td class="py-3 px-4 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                <span class="bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded text-[11px] border border-zinc-200 dark:border-zinc-700">
                  {{ s.code }}
                </span>
              </td>
              <td class="py-3 px-4 font-bold font-mono text-zinc-900 dark:text-zinc-100">M{{ Number(s.diameterMm) }}</td>
              <td class="py-3 px-4 font-bold font-mono text-zinc-900 dark:text-zinc-100">{{ Number(s.lengthMm) }} mm</td>
              <td class="py-3 px-4 text-zinc-500 dark:text-zinc-400">{{ s.headType }}</td>
              <td class="py-3 px-4 font-mono text-zinc-400 text-[11px]">{{ s.threadPitch || '-' }}</td>
              <td class="py-3 px-4">
                <span class="text-[11px] text-zinc-600 dark:text-zinc-400">
                  {{ s.material }} &bull; {{ s.finish }}
                </span>
              </td>
              <td class="py-3 px-4 text-zinc-400 text-[11px]">{{ s.notes || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 2: BOLT POSITIONS -->
    <div v-if="activeTab === 'positions'" class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm overflow-hidden transition-colors">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
              <th class="py-3 px-4 font-normal">#</th>
              <th class="py-3 px-4 font-normal">Kategori</th>
              <th class="py-3 px-4 font-normal">Nama Titik Posisi</th>
              <th class="py-3 px-4 font-normal">Catatan Peruntukan</th>
              <th class="py-3 px-4 font-normal text-center">Digunakan di Motor</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
            <tr v-for="p in positions" :key="p.id" class="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30">
              <td class="py-3 px-4 font-mono text-zinc-400 text-[11px]">{{ p.sortOrder }}</td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                  {{ p.category }}
                </span>
              </td>
              <td class="py-3 px-4 font-medium text-zinc-900 dark:text-zinc-100">{{ p.name }}</td>
              <td class="py-3 px-4 text-zinc-400 text-[11px]">{{ p.notes || '-' }}</td>
              <td class="py-3 px-4 text-center font-mono font-bold text-zinc-900 dark:text-zinc-100">
                <span class="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-[10px] border border-zinc-200 dark:border-zinc-700">
                  {{ p._count?.requirements || 0 }} Titik
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const activeTab = ref('specs');
const specs = ref([]);
const positions = ref([]);

const loadData = async () => {
  try {
    const [resSpecs, resPos] = await Promise.all([
      fetch('/api/bolt-specs', { headers: auth.authHeaders() }),
      fetch('/api/positions', { headers: auth.authHeaders() }),
    ]);
    specs.value = await resSpecs.json();
    positions.value = await resPos.json();
  } catch (err) {
    console.error(err);
  }
};

onMounted(loadData);
</script>
