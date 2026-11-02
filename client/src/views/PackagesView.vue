<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-[#121215] p-5 sm:p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
      <div>
        <div class="flex items-center space-x-2 mb-1">
          <span class="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
          <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Program 3</span>
        </div>
        <h1 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Paket Bundling Baut Motor
        </h1>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Struktur paket baut motor (Mesin, Pengereman, Full Bike) untuk percepatan penyiapan di gerai
        </p>
      </div>

      <router-link
        to="/pick-list"
        class="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
      >
        <span>Buka Pick-List Paket</span>
      </router-link>
    </div>

    <!-- Package Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="pkg in packages"
        :key="pkg.id"
        class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 p-5 shadow-sm flex flex-col justify-between transition-all"
      >
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              {{ pkg.packageType }}
            </span>
            <span class="text-[11px] font-mono text-zinc-400">
              {{ pkg.items.length }} Komponen
            </span>
          </div>

          <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            {{ pkg.name }}
          </h3>
          <p class="text-xs text-zinc-400 font-mono mt-0.5 mb-2">
            {{ pkg.motorcycleType.displayName }}
          </p>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2">
            {{ pkg.description }}
          </p>

          <div class="border-t border-zinc-100 dark:border-zinc-800/80 pt-3 space-y-1">
            <p class="text-[10px] font-mono uppercase text-zinc-400 mb-1.5">Rincian Komposisi:</p>
            <div
              v-for="item in pkg.items"
              :key="item.id"
              class="flex items-center justify-between text-xs py-1"
            >
              <span class="font-mono text-zinc-700 dark:text-zinc-300 text-[11px]">
                {{ item.boltSpec.code }} (M{{ Number(item.boltSpec.diameterMm) }}×{{ Number(item.boltSpec.lengthMm) }})
              </span>
              <span class="font-mono font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-[10px] border border-zinc-200 dark:border-zinc-700">
                {{ item.quantity }} pcs
              </span>
            </div>
          </div>
        </div>

        <div class="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          <button
            @click="pickThisPackage(pkg)"
            type="button"
            class="w-full py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
          >
            Pilih Paket &rarr;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();
const packages = ref([]);

const loadPackages = async () => {
  try {
    const res = await fetch('/api/packages', { headers: auth.authHeaders() });
    packages.value = await res.json();
  } catch (err) {
    console.error(err);
  }
};

const pickThisPackage = (pkg) => {
  router.push({
    path: '/pick-list',
    query: {
      motorId: pkg.motorcycleTypeId,
      pkgId: pkg.id,
    },
  });
};

onMounted(loadPackages);
</script>
