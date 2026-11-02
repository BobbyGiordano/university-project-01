<template>
  <div class="space-y-6">
    <!-- Header Card -->
    <div class="bg-white dark:bg-[#121215] p-5 sm:p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
      <div>
        <div class="flex items-center space-x-2 mb-1">
          <span class="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
          <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Master Data</span>
        </div>
        <h1 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Tipe Motor & Matriks Spesifikasi
        </h1>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Daftar tipe sepeda motor dan pemetaan titik baut titanium
        </p>
      </div>

      <button
        v-if="auth.isAdmin"
        @click="openAddMotorModal"
        type="button"
        class="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
      >
        <span>+</span>
        <span>Tambah Tipe Motor</span>
      </button>
    </div>

    <!-- Filters & Search -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="flex-1">
        <input
          v-model="search"
          type="text"
          placeholder="Cari merek, model, atau varian motor..."
          class="w-full px-3.5 py-2 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 shadow-sm"
        />
      </div>
      <div class="flex items-center space-x-1 bg-zinc-100 dark:bg-[#18181c] p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <button
          v-for="b in ['Semua', 'Honda', 'Yamaha', 'Suzuki', 'Kawasaki']"
          :key="b"
          @click="selectedBrand = b"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
          :class="[selectedBrand === b ? 'bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 font-semibold shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200']"
        >
          {{ b }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm overflow-hidden transition-colors">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
              <th class="py-3 px-4 font-normal">Foto</th>
              <th class="py-3 px-4 font-normal">Merek</th>
              <th class="py-3 px-4 font-normal">Model & Varian</th>
              <th class="py-3 px-4 font-normal">Tahun Rilis</th>
              <th class="py-3 px-4 font-normal text-center">Titik Baut</th>
              <th class="py-3 px-4 font-normal">Status</th>
              <th class="py-3 px-4 font-normal text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
            <tr
              v-for="m in filteredMotors"
              :key="m.id"
              class="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors"
            >
              <!-- Photo Thumbnail -->
              <td class="py-2.5 px-4">
                <div
                  @click="openMotorGallery(m)"
                  class="flex items-center space-x-2 cursor-pointer group"
                >
                  <div
                    class="w-10 h-10 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-zinc-800 group-hover:border-zinc-500 transition-all shrink-0 flex items-center justify-center relative"
                  >
                    <img
                      v-if="m.images && m.images.length > 0"
                      :src="m.images[0].url"
                      :alt="m.displayName"
                      class="w-full h-full object-cover"
                    />
                    <svg v-else class="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <!-- Count Pill -->
                    <span
                      v-if="m.images && m.images.length > 1"
                      class="absolute bottom-0.5 right-0.5 bg-black/80 text-[8px] font-mono px-1 rounded text-zinc-200"
                    >
                      {{ m.images.length }}
                    </span>
                  </div>
                  <span class="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-200 underline underline-offset-2">
                    {{ m.images && m.images.length > 0 ? `${m.images.length} foto` : '+ Foto' }}
                  </span>
                </div>
              </td>

              <td class="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                {{ m.brand }}
              </td>
              <td class="py-3 px-4">
                <span class="font-bold text-zinc-900 dark:text-zinc-100">{{ m.model }}</span>
                <span class="text-zinc-400 text-[11px] ml-1.5">{{ m.variant }}</span>
              </td>
              <td class="py-3 px-4 font-mono text-zinc-400 text-[11px]">
                {{ m.yearStart }}{{ m.yearEnd ? ` - ${m.yearEnd}` : '' }}
              </td>
              <td class="py-3 px-4 text-center">
                <span
                  class="inline-block px-2 py-0.5 rounded text-[10px] font-mono"
                  :class="[m._count.requirements > 0 ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700' : 'bg-transparent text-zinc-400']"
                >
                  {{ m._count.requirements }} Titik
                </span>
              </td>
              <td class="py-3 px-4">
                <span
                  class="inline-block px-2 py-0.5 text-[9px] font-mono rounded border"
                  :class="[m.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20']"
                >
                  {{ m.isActive ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="py-3 px-4 text-right space-x-1.5">
                <button
                  @click="openRequirementsModal(m)"
                  type="button"
                  class="px-2.5 py-1 text-xs font-medium rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
                >
                  Matriks Baut
                </button>
                <button
                  v-if="auth.isAdmin"
                  @click="toggleActiveStatus(m)"
                  type="button"
                  class="px-2 py-1 text-[11px] font-medium text-zinc-400 hover:text-zinc-200"
                >
                  {{ m.isActive ? 'Nonaktifkan' : 'Aktifkan' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- REQUIREMENTS MATRIX MODAL -->
    <div
      v-if="selectedMotorForReqs"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-white dark:bg-[#121215] rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <!-- Modal Header -->
        <div class="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div
              v-if="selectedMotorForReqs.images && selectedMotorForReqs.images.length > 0"
              @click="openMotorGallery(selectedMotorForReqs)"
              class="w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700 shrink-0 cursor-pointer hover:border-zinc-400 transition-all"
              title="Klik untuk melihat semua foto motor ini"
            >
              <img :src="selectedMotorForReqs.images[0].url" class="w-full h-full object-cover" />
            </div>
            <div>
              <span class="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Matriks Baut</span>
              <h2 class="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                {{ selectedMotorForReqs.displayName }}
              </h2>
            </div>
          </div>
          <button
            @click="selectedMotorForReqs = null"
            class="text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        <!-- Add Requirement Form (Admin only) -->
        <div v-if="auth.isAdmin" class="p-4 bg-zinc-50 dark:bg-[#18181c] border-b border-zinc-100 dark:border-zinc-800">
          <form @submit.prevent="handleAddRequirement" class="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
            <div class="sm:col-span-4">
              <select
                v-model="newReq.boltPositionId"
                required
                class="w-full px-2.5 py-1.5 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-200"
              >
                <option value="">Pilih Posisi...</option>
                <option v-for="p in allPositions" :key="p.id" :value="p.id">
                  {{ p.name }} ({{ p.category }})
                </option>
              </select>
            </div>

            <div class="sm:col-span-4">
              <select
                v-model="newReq.boltSpecId"
                required
                class="w-full px-2.5 py-1.5 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-200 font-mono"
              >
                <option value="">Pilih Kode Baut...</option>
                <option v-for="s in allSpecs" :key="s.id" :value="s.id">
                  {{ s.code }} (M{{ Number(s.diameterMm) }}×{{ Number(s.lengthMm) }})
                </option>
              </select>
            </div>

            <div class="sm:col-span-2">
              <select
                v-model="newReq.side"
                class="w-full px-2.5 py-1.5 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-200"
              >
                <option value="NONE">Netral</option>
                <option value="LEFT">Kiri</option>
                <option value="RIGHT">Kanan</option>
                <option value="FRONT">Depan</option>
                <option value="REAR">Belakang</option>
              </select>
            </div>

            <div class="sm:col-span-1">
              <input
                v-model.number="newReq.quantity"
                type="number"
                min="1"
                required
                placeholder="Qty"
                class="w-full px-2 py-1.5 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-200 font-bold text-center"
              />
            </div>

            <div class="sm:col-span-1">
              <button
                type="submit"
                class="w-full py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold rounded-lg text-xs"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>

        <!-- Matrix List -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="matrixList.length === 0" class="text-center py-8 text-xs text-zinc-400 font-mono">
            Belum ada spesifikasi baut untuk motor ini.
          </div>

          <table v-else class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase">
                <th class="py-2.5 px-3">Kategori & Posisi</th>
                <th class="py-2.5 px-3">Sisi</th>
                <th class="py-2.5 px-3">Kode Baut</th>
                <th class="py-2.5 px-3">Ukuran</th>
                <th class="py-2.5 px-3 text-center">Jumlah</th>
                <th v-if="auth.isAdmin" class="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              <tr v-for="req in matrixList" :key="req.id">
                <td class="py-2.5 px-3">
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mr-1.5">
                    {{ req.boltPosition.category }}
                  </span>
                  <span class="font-medium text-zinc-900 dark:text-zinc-100">{{ req.boltPosition.name }}</span>
                </td>
                <td class="py-2.5 px-3 text-zinc-400 font-mono text-[11px]">
                  {{ req.side }}
                </td>
                <td class="py-2.5 px-3">
                  <div class="flex items-center space-x-2">
                    <div
                      v-if="req.boltSpec?.images && req.boltSpec.images.length > 0"
                      class="w-6 h-6 rounded bg-zinc-900 border border-zinc-700 overflow-hidden shrink-0"
                    >
                      <img :src="req.boltSpec.images[0].url" class="w-full h-full object-cover" />
                    </div>
                    <span class="font-mono font-bold text-zinc-900 dark:text-zinc-100">{{ req.boltSpec.code }}</span>
                  </div>
                </td>
                <td class="py-2.5 px-3 text-zinc-500 font-mono">
                  M{{ Number(req.boltSpec.diameterMm) }} × {{ Number(req.boltSpec.lengthMm) }}
                </td>
                <td class="py-2.5 px-3 text-center font-bold">
                  {{ req.quantity }} pcs
                </td>
                <td v-if="auth.isAdmin" class="py-2.5 px-3 text-right">
                  <button
                    @click="handleDeleteReq(req.id)"
                    class="text-xs text-rose-500 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ADD MOTOR MODAL -->
    <div
      v-if="isAddMotorModalOpen"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="bg-white dark:bg-[#121215] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
        <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Tambah Tipe Motor Baru
        </h3>

        <form @submit.prevent="handleCreateMotor" class="space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Merek</label>
              <select
                v-model="newMotor.brand"
                required
                class="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-200"
              >
                <option value="Honda">Honda</option>
                <option value="Yamaha">Yamaha</option>
                <option value="Suzuki">Suzuki</option>
                <option value="Kawasaki">Kawasaki</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Model</label>
              <input
                v-model="newMotor.model"
                type="text"
                placeholder="Vario, NMAX"
                required
                class="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-200"
              />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Varian</label>
            <input
              v-model="newMotor.variant"
              type="text"
              placeholder="160 ABS, Connected"
              required
              class="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-200"
            />
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Tahun Awal</label>
              <input
                v-model.number="newMotor.yearStart"
                type="number"
                min="1990"
                max="2030"
                required
                class="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-200"
              />
            </div>
            <div>
              <label class="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Tahun Akhir</label>
              <input
                v-model.number="newMotor.yearEnd"
                type="number"
                min="1990"
                max="2030"
                placeholder="2026"
                class="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-200"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              @click="isAddMotorModalOpen = false"
              type="button"
              class="px-3 py-1.5 text-zinc-400 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold rounded-lg"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- PHOTO GALLERY MODAL -->
    <PhotoGalleryModal
      v-if="selectedMotorForGallery"
      :is-open="Boolean(selectedMotorForGallery)"
      category-title="Foto Tipe Sepeda Motor"
      :item-title="selectedMotorForGallery.displayName"
      :item-subtitle="`${selectedMotorForGallery.brand} • ${selectedMotorForGallery.model} (${selectedMotorForGallery.yearStart}${selectedMotorForGallery.yearEnd ? `-${selectedMotorForGallery.yearEnd}` : ''})`"
      :images="selectedMotorForGallery.images || []"
      :can-manage="auth.isAdmin"
      :upload-endpoint="`/api/motorcycles/${selectedMotorForGallery.id}/images`"
      :delete-endpoint-base="`/api/motorcycles/${selectedMotorForGallery.id}/images`"
      :primary-endpoint-base="`/api/motorcycles/${selectedMotorForGallery.id}/images`"
      :auth-headers="auth.authHeaders"
      @close="selectedMotorForGallery = null"
      @updated="onMotorGalleryUpdated"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import PhotoGalleryModal from '../components/PhotoGalleryModal.vue';

const auth = useAuthStore();
const motorcycles = ref([]);
const search = ref('');
const selectedBrand = ref('Semua');
const selectedMotorForGallery = ref(null);

const openMotorGallery = (motor) => {
  selectedMotorForGallery.value = motor;
};

const onMotorGalleryUpdated = (updatedImages) => {
  if (selectedMotorForGallery.value) {
    selectedMotorForGallery.value.images = updatedImages;
    const target = motorcycles.value.find((m) => m.id === selectedMotorForGallery.value.id);
    if (target) {
      target.images = updatedImages;
    }
  }
};

const selectedMotorForReqs = ref(null);
const matrixList = ref([]);
const allPositions = ref([]);
const allSpecs = ref([]);

const isAddMotorModalOpen = ref(false);
const newMotor = ref({ brand: 'Honda', model: '', variant: '', yearStart: 2024, yearEnd: 2026 });
const newReq = ref({ boltPositionId: '', boltSpecId: '', side: 'NONE', quantity: 1 });

const filteredMotors = computed(() => {
  return motorcycles.value.filter((m) => {
    const matchBrand = selectedBrand.value === 'Semua' || m.brand.toLowerCase() === selectedBrand.value.toLowerCase();
    const q = search.value.toLowerCase();
    const matchSearch = !q || m.displayName.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q) || m.model.toLowerCase().includes(q);
    return matchBrand && matchSearch;
  });
});

const loadMotors = async () => {
  try {
    const res = await fetch('/api/motorcycles', { headers: auth.authHeaders() });
    motorcycles.value = await res.json();
  } catch (err) {
    console.error(err);
  }
};

const openRequirementsModal = async (motor) => {
  selectedMotorForReqs.value = motor;
  try {
    const [resReqs, resPos, resSpecs] = await Promise.all([
      fetch(`/api/motorcycles/${motor.id}/requirements`, { headers: auth.authHeaders() }),
      fetch('/api/positions', { headers: auth.authHeaders() }),
      fetch('/api/bolt-specs', { headers: auth.authHeaders() }),
    ]);
    matrixList.value = await resReqs.json();
    allPositions.value = await resPos.json();
    allSpecs.value = await resSpecs.json();
  } catch (err) {
    alert(err.message);
  }
};

const handleAddRequirement = async () => {
  try {
    const res = await fetch(`/api/motorcycles/${selectedMotorForReqs.value.id}/requirements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...auth.authHeaders() },
      body: JSON.stringify(newReq.value),
    });
    const created = await res.json();
    if (!res.ok) throw new Error(created.error || 'Gagal menambahkan requirement.');

    matrixList.value.push(created);
    newReq.value = { boltPositionId: '', boltSpecId: '', side: 'NONE', quantity: 1 };
    await loadMotors();
  } catch (err) {
    alert(err.message);
  }
};

const handleDeleteReq = async (id) => {
  if (!confirm('Yakin ingin menghapus titik baut ini?')) return;
  try {
    const res = await fetch(`/api/requirements/${id}`, {
      method: 'DELETE',
      headers: auth.authHeaders(),
    });
    if (!res.ok) throw new Error('Gagal menghapus requirement.');
    matrixList.value = matrixList.value.filter((r) => r.id !== id);
    await loadMotors();
  } catch (err) {
    alert(err.message);
  }
};

const openAddMotorModal = () => {
  newMotor.value = { brand: 'Honda', model: '', variant: '', yearStart: 2024, yearEnd: 2026 };
  isAddMotorModalOpen.value = true;
};

const handleCreateMotor = async () => {
  try {
    const res = await fetch('/api/motorcycles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...auth.authHeaders() },
      body: JSON.stringify(newMotor.value),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    isAddMotorModalOpen.value = false;
    await loadMotors();
  } catch (err) {
    alert(err.message);
  }
};

const toggleActiveStatus = async (motor) => {
  try {
    const res = await fetch(`/api/motorcycles/${motor.id}/deactivate`, {
      method: 'PATCH',
      headers: auth.authHeaders(),
    });
    const updated = await res.json();
    if (!res.ok) throw new Error(updated.error);
    motor.isActive = updated.isActive;
  } catch (err) {
    alert(err.message);
  }
};

onMounted(loadMotors);
</script>
