<template>
  <div class="space-y-6">
    <!-- Top Filter & Selector Bar (Obsidian Card) -->
    <div class="bg-white dark:bg-[#121215] p-5 sm:p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm transition-colors">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <div class="flex items-center space-x-2">
            <h1 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Daftar Ambil Baut
            </h1>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700">
              PICK-LIST
            </span>
          </div>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Penyiapan instan komponen baut titanium per tipe motor & paket
          </p>
        </div>

        <!-- Action Controls -->
        <div v-if="pickData" class="flex items-center space-x-2 no-print">
          <button
            @click="handlePrint"
            type="button"
            class="px-3.5 py-2 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <svg class="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
            <span>Cetak</span>
          </button>
          
          <button
            @click="startSession"
            :disabled="isCreatingSession"
            type="button"
            class="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-40"
          >
            {{ isCreatingSession ? 'Menyiapkan...' : 'Mulai Checklist' }}
          </button>
        </div>
      </div>

      <!-- Selector Inputs -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3 no-print pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
        <!-- Motorcycle Dropdown -->
        <div class="md:col-span-6">
          <label class="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
            Model Motor
          </label>
          <div class="relative">
            <select
              v-model="selectedMotorcycleId"
              @change="onMotorcycleChange"
              class="w-full pl-3 pr-9 py-2 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="">-- Pilih Model Sepeda Motor --</option>
              <optgroup label="Honda">
                <option v-for="m in hondaMotors" :key="m.id" :value="m.id">
                  {{ m.displayName }}
                </option>
              </optgroup>
              <optgroup label="Yamaha">
                <option v-for="m in yamahaMotors" :key="m.id" :value="m.id">
                  {{ m.displayName }}
                </option>
              </optgroup>
              <optgroup label="Suzuki">
                <option v-for="m in suzukiMotors" :key="m.id" :value="m.id">
                  {{ m.displayName }}
                </option>
              </optgroup>
              <optgroup label="Kawasaki">
                <option v-for="m in kawasakiMotors" :key="m.id" :value="m.id">
                  {{ m.displayName }}
                </option>
              </optgroup>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-2.5 pointer-events-none text-zinc-400">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <!-- Package Dropdown -->
        <div class="md:col-span-4">
          <label class="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
            Paket Bundling
          </label>
          <div class="relative">
            <select
              v-model="selectedPackageId"
              :disabled="!selectedMotorcycleId"
              class="w-full pl-3 pr-9 py-2 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-500 disabled:opacity-30 transition-colors appearance-none cursor-pointer"
            >
              <option value="">Kebutuhan Penuh (Full Bike)</option>
              <option v-for="pkg in availablePackages" :key="pkg.id" :value="pkg.id">
                {{ pkg.name }} ({{ pkg.packageType }})
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-2.5 pointer-events-none text-zinc-400">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="md:col-span-2 flex items-end">
          <button
            @click="generatePickList"
            :disabled="!selectedMotorcycleId || isLoading"
            type="button"
            class="w-full py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-semibold text-xs rounded-xl shadow-sm transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-center"
          >
            <span v-if="isLoading">Memuat...</span>
            <span v-else>Tampilkan</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Warnings Box (if any) -->
    <div
      v-if="pickData?.summary?.hasWarnings"
      class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start space-x-3 text-xs"
    >
      <span class="text-amber-400 font-bold">!</span>
      <div>
        <h4 class="font-semibold text-amber-300">Peringatan Kelengkapan:</h4>
        <ul class="text-amber-200/80 mt-1 list-disc list-inside space-y-0.5">
          <li v-for="(w, idx) in pickData.summary.warnings" :key="idx">{{ w }}</li>
        </ul>
      </div>
    </div>

    <!-- Generated Content -->
    <div v-if="pickData" class="space-y-5">

      <!-- Metrics Row (Minimalist Obsidian Cards) -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <!-- Metric 1: Motor -->
        <div class="bg-white dark:bg-[#121215] p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm flex items-center space-x-3">
          <div
            v-if="pickData.motorcycle.images && pickData.motorcycle.images.length > 0"
            @click="openMotorcycleModal(pickData.motorcycle)"
            class="w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shrink-0 cursor-pointer hover:border-zinc-400 transition-all"
            title="Klik untuk melihat foto motor"
          >
            <img :src="pickData.motorcycle.images[0].url" :alt="pickData.motorcycle.displayName" class="w-full h-full object-cover" />
          </div>
          <div class="min-w-0 flex-1">
            <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-0.5">Kendaraan</span>
            <p class="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {{ pickData.motorcycle.model }} {{ pickData.motorcycle.variant }}
            </p>
            <span class="text-[11px] text-zinc-500 font-mono block mt-0.5 truncate">
              {{ pickData.package ? pickData.package.name : 'Matriks Standar' }}
            </span>
          </div>
        </div>

        <!-- Metric 2: Total Baut -->
        <div class="bg-white dark:bg-[#121215] p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Total Baut</span>
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
          <div class="flex items-baseline space-x-1">
            <span class="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 tracking-tight">
              {{ pickData.summary.totalQuantity }}
            </span>
            <span class="text-xs text-zinc-500">pcs</span>
          </div>
          <span class="text-[11px] text-zinc-400 block mt-0.5">Siap penyiapan</span>
        </div>

        <!-- Metric 3: Ragam Ukuran -->
        <div class="bg-white dark:bg-[#121215] p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Variasi Ukuran</span>
            <span class="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
          </div>
          <div class="flex items-baseline space-x-1">
            <span class="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 tracking-tight">
              {{ pickData.summary.distinctBoltSpecsCount }}
            </span>
            <span class="text-xs text-zinc-500">item</span>
          </div>
          <span class="text-[11px] text-zinc-400 block mt-0.5">Terkonsolidasi</span>
        </div>

        <!-- Metric 4: Estimasi Waktu -->
        <div class="bg-white dark:bg-[#121215] p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Estimasi Siap</span>
            <span class="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
          </div>
          <div class="flex items-baseline space-x-1">
            <span class="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 tracking-tight">
              5–10
            </span>
            <span class="text-xs text-zinc-500">menit</span>
          </div>
          <span class="text-[11px] text-emerald-500 font-medium block mt-0.5">Hemat &gt;50%</span>
        </div>
      </div>

      <!-- Segmented Control (Minimalist, Zero Emojis) -->
      <div class="flex items-center justify-between no-print">
        <div class="inline-flex p-1 bg-zinc-100 dark:bg-[#18181c] rounded-xl border border-zinc-200 dark:border-zinc-800">
          <button
            @click="activeTab = 'consolidated'"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
            :class="[activeTab === 'consolidated' ? 'bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 font-semibold shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200']"
          >
            Ringkasan Ukuran Rak ({{ pickData.consolidatedTotals.length }})
          </button>
          <button
            @click="activeTab = 'breakdown'"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
            :class="[activeTab === 'breakdown' ? 'bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 font-semibold shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200']"
          >
            Rincian Titik Pasang ({{ pickData.positionBreakdown.length }})
          </button>
        </div>

        <span class="text-[11px] text-zinc-400 font-mono hidden sm:block">
          {{ activeTab === 'consolidated' ? 'Dikelompokkan per spesifikasi unik' : 'Dikelompokkan per area motor' }}
        </span>
      </div>

      <!-- TAB 1: CONSOLIDATED TOTALS TABLE (Linear / Raycast Style) -->
      <div v-if="activeTab === 'consolidated'" class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm overflow-hidden transition-colors">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
                <th class="py-3 px-4 font-normal">#</th>
                <th class="py-3 px-4 font-normal">Kode Baut</th>
                <th class="py-3 px-4 font-normal">Dimensi (D × P)</th>
                <th class="py-3 px-4 font-normal">Kepala</th>
                <th class="py-3 px-4 font-normal">Material & Finishing</th>
                <th class="py-3 px-4 font-normal text-center">Jumlah Ambil</th>
                <th class="py-3 px-4 font-normal">Posisi Pada Motor</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              <tr
                v-for="(item, index) in pickData.consolidatedTotals"
                :key="item.boltSpecId"
                class="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors"
              >
                <td class="py-3 px-4 font-mono text-zinc-400 text-[11px]">{{ index + 1 }}</td>
                <td class="py-3 px-4">
                  <div class="flex items-center space-x-2.5">
                    <div
                      v-if="item.images && item.images.length > 0"
                      @click="openBoltModal(item)"
                      class="w-9 h-9 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 transition-all cursor-pointer shrink-0"
                      title="Klik untuk melihat foto baut"
                    >
                      <img :src="item.images[0].url" :alt="item.code" class="w-full h-full object-cover" />
                    </div>
                    <span
                      @click="openBoltModal(item)"
                      class="font-mono text-zinc-900 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded text-[11px] border border-zinc-200 dark:border-zinc-700/60 cursor-pointer hover:border-zinc-400 transition-all"
                    >
                      {{ item.code }}
                    </span>
                  </div>
                </td>
                <td class="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  M{{ Number(item.diameterMm) }} × {{ Number(item.lengthMm) }} mm
                </td>
                <td class="py-3 px-4 text-zinc-500 dark:text-zinc-400">
                  {{ item.headType }}
                </td>
                <td class="py-3 px-4">
                  <span class="inline-flex items-center space-x-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                    <span>{{ item.material }}</span>
                    <span class="text-zinc-400">&bull;</span>
                    <span class="font-medium text-zinc-700 dark:text-zinc-300">{{ item.finish }}</span>
                  </span>
                </td>
                <td class="py-3 px-4 text-center">
                  <span class="inline-block px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
                    {{ item.totalQuantity }} pcs
                  </span>
                </td>
                <td class="py-3 px-4 text-[11px] text-zinc-400 max-w-xs truncate" :title="item.positionsSummary">
                  {{ item.positionsSummary }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 2: POSITION BREAKDOWN TABLE -->
      <div v-if="activeTab === 'breakdown'" class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm overflow-hidden transition-colors">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
                <th class="py-3 px-4 font-normal">Kategori</th>
                <th class="py-3 px-4 font-normal">Titik Posisi</th>
                <th class="py-3 px-4 font-normal">Sisi</th>
                <th class="py-3 px-4 font-normal">Kode Baut</th>
                <th class="py-3 px-4 font-normal">Ukuran</th>
                <th class="py-3 px-4 font-normal text-center">Kuantitas</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              <tr
                v-for="(row, idx) in pickData.positionBreakdown"
                :key="idx"
                class="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors"
              >
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                    {{ row.category }}
                  </span>
                </td>
                <td class="py-3 px-4 font-medium text-zinc-900 dark:text-zinc-100">
                  {{ row.positionName }}
                </td>
                <td class="py-3 px-4 font-mono text-[11px] text-zinc-400">
                  <span v-if="row.side === 'LEFT'">Kiri (L)</span>
                  <span v-else-if="row.side === 'RIGHT'">Kanan (R)</span>
                  <span v-else-if="row.side === 'FRONT'">Depan (F)</span>
                  <span v-else-if="row.side === 'REAR'">Belakang (R)</span>
                  <span v-else>-</span>
                </td>
                <td class="py-3 px-4 font-mono text-zinc-900 dark:text-zinc-200">
                  <div class="flex items-center space-x-2">
                    <div
                      v-if="row.boltSpec?.images && row.boltSpec.images.length > 0"
                      @click="openBoltModal(row.boltSpec)"
                      class="w-7 h-7 rounded bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 transition-all cursor-pointer shrink-0 overflow-hidden"
                      title="Klik untuk melihat foto baut"
                    >
                      <img :src="row.boltSpec.images[0].url" :alt="row.boltSpec.code" class="w-full h-full object-cover" />
                    </div>
                    <span @click="openBoltModal(row.boltSpec)" class="cursor-pointer hover:underline">{{ row.boltSpec.code }}</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-zinc-500 font-mono text-[11px]">
                  M{{ Number(row.boltSpec.diameterMm) }} × {{ Number(row.boltSpec.lengthMm) }}
                </td>
                <td class="py-3 px-4 text-center font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  {{ row.quantity }} pcs
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- Empty State -->
    <div
      v-else-if="!isLoading"
      class="text-center py-16 px-4 bg-white dark:bg-[#121215] rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800"
    >
      <div class="w-10 h-10 mx-auto mb-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center text-zinc-400">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
      </div>
      <h3 class="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Pilih Tipe Motor</h3>
      <p class="text-[11px] text-zinc-400 max-w-xs mx-auto mt-0.5">
        Pilih model motor pada menu di atas untuk menghasilkan daftar baut.
      </p>
    </div>

    <!-- PHOTO GALLERY MODAL -->
    <PhotoGalleryModal
      v-if="galleryModal.isOpen"
      :is-open="galleryModal.isOpen"
      :category-title="galleryModal.categoryTitle"
      :item-title="galleryModal.itemTitle"
      :item-subtitle="galleryModal.itemSubtitle"
      :images="galleryModal.images"
      :can-manage="auth.isAdmin"
      :upload-endpoint="galleryModal.uploadEndpoint"
      :delete-endpoint-base="galleryModal.deleteEndpointBase"
      :primary-endpoint-base="galleryModal.primaryEndpointBase"
      :auth-headers="auth.authHeaders"
      @close="galleryModal.isOpen = false"
      @updated="onGalleryUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import PhotoGalleryModal from '../components/PhotoGalleryModal.vue';

const router = useRouter();
const auth = useAuthStore();

const motorcycles = ref([]);
const packages = ref([]);
const selectedMotorcycleId = ref('');
const selectedPackageId = ref('');
const isLoading = ref(false);
const isCreatingSession = ref(false);
const pickData = ref(null);
const activeTab = ref('consolidated');

const galleryModal = ref({
  isOpen: false,
  categoryTitle: '',
  itemTitle: '',
  itemSubtitle: '',
  images: [],
  uploadEndpoint: '',
  deleteEndpointBase: '',
  primaryEndpointBase: '',
});

const openMotorcycleModal = (motor) => {
  galleryModal.value = {
    isOpen: true,
    categoryTitle: 'Foto Tipe Sepeda Motor',
    itemTitle: motor.displayName || `${motor.brand} ${motor.model}`,
    itemSubtitle: `${motor.brand} ${motor.model} ${motor.variant || ''}`,
    images: motor.images || [],
    uploadEndpoint: `/api/motorcycles/${motor.id}/images`,
    deleteEndpointBase: `/api/motorcycles/${motor.id}/images`,
    primaryEndpointBase: `/api/motorcycles/${motor.id}/images`,
  };
};

const openBoltModal = (bolt) => {
  const spec = bolt.boltSpec || bolt;
  galleryModal.value = {
    isOpen: true,
    categoryTitle: 'Foto Spesifikasi Baut Titanium',
    itemTitle: spec.code,
    itemSubtitle: `${spec.headType || ''} M${Number(spec.diameterMm)} × ${Number(spec.lengthMm)}mm • ${spec.finish || ''}`,
    images: spec.images || [],
    uploadEndpoint: `/api/bolt-specs/${spec.id || spec.boltSpecId}/images`,
    deleteEndpointBase: `/api/bolt-specs/${spec.id || spec.boltSpecId}/images`,
    primaryEndpointBase: `/api/bolt-specs/${spec.id || spec.boltSpecId}/images`,
  };
};

const onGalleryUpdated = (updatedImages) => {
  galleryModal.value.images = updatedImages;
};

const hondaMotors = computed(() => motorcycles.value.filter((m) => m.brand.toLowerCase() === 'honda'));
const yamahaMotors = computed(() => motorcycles.value.filter((m) => m.brand.toLowerCase() === 'yamaha'));
const suzukiMotors = computed(() => motorcycles.value.filter((m) => m.brand.toLowerCase() === 'suzuki'));
const kawasakiMotors = computed(() => motorcycles.value.filter((m) => m.brand.toLowerCase() === 'kawasaki'));

const availablePackages = computed(() => {
  if (!selectedMotorcycleId.value) return [];
  return packages.value.filter((p) => p.motorcycleTypeId === parseInt(selectedMotorcycleId.value, 10));
});

const loadInitialData = async () => {
  try {
    const [resMotors, resPkgs] = await Promise.all([
      fetch('/api/motorcycles', { headers: auth.authHeaders() }),
      fetch('/api/packages', { headers: auth.authHeaders() }),
    ]);
    motorcycles.value = await resMotors.json();
    packages.value = await resPkgs.json();

    const defaultMotor = motorcycles.value.find((m) => m.displayName.includes('NMAX 155')) || motorcycles.value[0];
    if (defaultMotor) {
      selectedMotorcycleId.value = defaultMotor.id;
      await generatePickList();
    }
  } catch (err) {
    console.error('Error loading initial data:', err);
  }
};

const onMotorcycleChange = () => {
  selectedPackageId.value = '';
  generatePickList();
};

const generatePickList = async () => {
  if (!selectedMotorcycleId.value) return;
  isLoading.value = true;
  try {
    const res = await fetch('/api/pick-lists/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...auth.authHeaders(),
      },
      body: JSON.stringify({
        motorcycleTypeId: parseInt(selectedMotorcycleId.value, 10),
        packageId: selectedPackageId.value ? parseInt(selectedPackageId.value, 10) : undefined,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal memuat daftar ambil baut.');
    }

    pickData.value = await res.json();
  } catch (err) {
    alert(err.message);
  } finally {
    isLoading.value = false;
  }
};

const startSession = async () => {
  if (!pickData.value) return;
  isCreatingSession.value = true;
  try {
    const res = await fetch('/api/pick-lists/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...auth.authHeaders(),
      },
      body: JSON.stringify({
        motorcycleTypeId: pickData.value.motorcycle.id,
        packageId: pickData.value.package?.id || null,
        notes: `Pengambilan baut ${pickData.value.motorcycle.displayName}${pickData.value.package ? ` - ${pickData.value.package.name}` : ''}`,
        items: pickData.value.consolidatedTotals.map((item) => ({
          boltSpecId: item.boltSpecId,
          quantity: item.totalQuantity,
          positionSummary: item.positionsSummary,
          checked: false,
        })),
      }),
    });

    const session = await res.json();
    if (!res.ok) throw new Error(session.error || 'Gagal memulai sesi.');
    router.push(`/pick-list/${session.id}`);
  } catch (err) {
    alert(err.message);
  } finally {
    isCreatingSession.value = false;
  }
};

const handlePrint = () => {
  window.print();
};

onMounted(loadInitialData);
</script>
