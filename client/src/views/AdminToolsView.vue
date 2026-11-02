<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-[#121215] p-5 sm:p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
      <div>
        <div class="flex items-center space-x-2 mb-1">
          <span class="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
          <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Administrasi</span>
        </div>
        <h1 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Admin Tools & Pemeliharaan
        </h1>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Impor CSV massal, cadangan offline (backup), pemulihan data (restore), dan catatan audit
        </p>
      </div>

      <!-- Segmented Navigation Tabs -->
      <div class="inline-flex p-1 bg-zinc-100 dark:bg-[#18181c] rounded-xl border border-zinc-200 dark:border-zinc-800">
        <button
          @click="activeTab = 'import'"
          class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer"
          :class="[activeTab === 'import' ? 'bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 font-semibold shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200']"
        >
          Impor CSV
        </button>
        <button
          @click="activeTab = 'backup'"
          class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer"
          :class="[activeTab === 'backup' ? 'bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 font-semibold shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200']"
        >
          Backup & Restore
        </button>
        <button
          @click="activeTab = 'audit'"
          class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer"
          :class="[activeTab === 'audit' ? 'bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 font-semibold shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200']"
        >
          Audit Log
        </button>
      </div>
    </div>

    <!-- TAB 1: CSV IMPORT -->
    <div v-if="activeTab === 'import'" class="grid grid-cols-1 md:grid-cols-12 gap-5">
      <div class="md:col-span-6 bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 p-5 sm:p-6 shadow-sm transition-colors">
        <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          Unggah File CSV Kebutuhan Baut
        </h3>
        <p class="text-xs text-zinc-400 mb-4">
          Masukkan data spesifikasi baut 20 tipe motor secara serentak. Sistem memvalidasi seluruh baris sebelum transaksi disimpan.
        </p>

        <div class="space-y-3.5">
          <div class="border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl p-5 text-center hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
            <input
              type="file"
              ref="fileInput"
              accept=".csv"
              @change="onFileSelected"
              class="hidden"
              id="csvFileInput"
            />
            <label for="csvFileInput" class="cursor-pointer block">
              <span class="text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:underline block">
                {{ selectedFile ? selectedFile.name : 'Pilih Berkas CSV' }}
              </span>
              <p class="text-[10px] text-zinc-400 font-mono mt-1">Format .csv (Maksimal 10MB)</p>
            </label>
          </div>

          <button
            @click="uploadCsv"
            :disabled="!selectedFile || isUploading"
            type="button"
            class="w-full py-2 px-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-40"
          >
            {{ isUploading ? 'Memvalidasi Seluruh Baris...' : 'Mulai Impor CSV' }}
          </button>
        </div>

        <div v-if="importMessage" class="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
          {{ importMessage }}
        </div>

        <div v-if="importErrors.length > 0" class="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
          <h4 class="text-xs font-bold text-rose-300 mb-2">
            Terdapat {{ importErrors.length }} Kesalahan (Impor Dibatalkan Sepenuhnya):
          </h4>
          <ul class="text-[11px] text-rose-200/80 space-y-1 list-disc list-inside max-h-40 overflow-y-auto font-mono">
            <li v-for="(err, idx) in importErrors" :key="idx">
              Baris {{ err.row }}: {{ err.message }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Format Column Guide -->
      <div class="md:col-span-6 bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 p-5 sm:p-6 shadow-sm transition-colors">
        <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          Format Kolom CSV
        </h3>
        <p class="text-xs text-zinc-400 mb-2.5">
          Nama kolom harus persis sesuai urutan berikut:
        </p>

        <div class="bg-zinc-50 dark:bg-[#18181c] p-2.5 rounded-lg font-mono text-[10px] text-zinc-600 dark:text-zinc-300 overflow-x-auto mb-3.5 border border-zinc-200 dark:border-zinc-800">
          brand,model,variant,year_start,year_end,position,bolt_code,quantity,side,is_optional,notes
        </div>

        <h4 class="text-[11px] font-mono uppercase text-zinc-400 mb-1">Contoh Baris Data:</h4>
        <div class="bg-zinc-50 dark:bg-[#18181c] p-2.5 rounded-lg font-mono text-[10px] text-zinc-500 overflow-x-auto space-y-1 mb-3.5 border border-zinc-200 dark:border-zinc-800">
          <p>Honda,Vario,160 CBS/ABS,2022,2026,Cover Crankcase Kiri / CVT,HEX-M6-25-FL,8,LEFT,false,Bak CVT</p>
          <p>Yamaha,NMAX,155 Connected,2020,2024,Kaliper Cakram Depan,HEX-M8-30-FL,2,FRONT,false,Baut kaliper</p>
        </div>

        <button
          @click="downloadTemplate"
          type="button"
          class="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-white flex items-center space-x-1 cursor-pointer"
        >
          <span>📥</span>
          <span>Unduh Berkas Template CSV</span>
        </button>
      </div>
    </div>

    <!-- TAB 2: BACKUP & RESTORE -->
    <div v-if="activeTab === 'backup'" class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 p-5 sm:p-6 shadow-sm transition-colors">
        <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          Cadangan Data (Backup Snapshot)
        </h3>
        <p class="text-xs text-zinc-400 mb-4 leading-relaxed">
          Ekspor salinan cadangan lengkap seluruh master data motor, posisi, spesifikasi baut, matriks kebutuhan, dan paket bundling ke berkas lokal. Disarankan disimpan ke Flashdisk USB toko setiap sore.
        </p>

        <button
          @click="downloadBackup"
          type="button"
          class="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
        >
          Unduh Cadangan Basis Data (.JSON)
        </button>
      </div>

      <div class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 p-5 sm:p-6 shadow-sm transition-colors">
        <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          Pemulihan Data (Restore Snapshot)
        </h3>
        <p class="text-xs text-zinc-400 mb-4 leading-relaxed">
          Pulihkan basis data dari berkas cadangan JSON jika terjadi kendala teknis atau pergantian perangkat komputer gerai.
        </p>

        <div class="space-y-3">
          <input
            type="file"
            accept=".json"
            @change="onRestoreFileSelected"
            class="block w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 file:text-zinc-700 dark:file:bg-zinc-800 dark:file:text-zinc-200"
          />

          <div v-if="restoreJsonData">
            <label class="block text-[11px] font-mono text-rose-400 mb-1">
              Ketik "RESTORE_HEXTITANIUM" untuk konfirmasi:
            </label>
            <input
              v-model="restoreConfirmText"
              type="text"
              class="w-full text-xs px-3 py-1.5 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
              placeholder="RESTORE_HEXTITANIUM"
            />
          </div>

          <button
            @click="executeRestore"
            :disabled="!restoreJsonData || restoreConfirmText !== 'RESTORE_HEXTITANIUM' || isRestoring"
            type="button"
            class="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-sm disabled:opacity-30 transition-all cursor-pointer"
          >
            {{ isRestoring ? 'Memulihkan Basis Data...' : 'Konfirmasi Pemulihan Data' }}
          </button>
        </div>
      </div>
    </div>

    <!-- TAB 3: AUDIT LOG -->
    <div v-if="activeTab === 'audit'" class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm overflow-hidden transition-colors">
      <div class="p-4 px-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
        <span class="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
          Riwayat Aktivitas Sistem (50 Aktivitas Terakhir)
        </span>
        <button @click="loadAuditLogs" class="text-xs text-zinc-400 hover:text-zinc-100 font-mono">
          Segarkan
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase">
              <th class="py-3 px-4 font-normal">Waktu</th>
              <th class="py-3 px-4 font-normal">Pengguna</th>
              <th class="py-3 px-4 font-normal">Aksi</th>
              <th class="py-3 px-4 font-normal">Entitas</th>
              <th class="py-3 px-4 font-normal">Detail Perubahan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
            <tr v-for="log in auditLogs" :key="log.id" class="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30">
              <td class="py-2.5 px-4 font-mono text-zinc-400 whitespace-nowrap text-[11px]">
                {{ formatDateTime(log.timestamp) }}
              </td>
              <td class="py-2.5 px-4 font-medium text-zinc-900 dark:text-zinc-100">
                {{ log.user ? log.user.name : 'Sistem' }}
              </td>
              <td class="py-2.5 px-4">
                <span class="px-2 py-0.5 rounded font-mono text-[10px] border"
                  :class="[
                    log.action === 'CREATE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    log.action === 'UPDATE' ? 'bg-zinc-800 text-zinc-300 border-zinc-700' :
                    log.action === 'DELETE' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    'bg-zinc-800 text-zinc-400 border-zinc-700'
                  ]"
                >
                  {{ log.action }}
                </span>
              </td>
              <td class="py-2.5 px-4 font-mono text-zinc-400 text-[11px]">
                {{ log.entity }}
              </td>
              <td class="py-2.5 px-4 text-zinc-500">
                {{ log.detail || '-' }}
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
import { formatDateTime } from '../utils/date';

const auth = useAuthStore();
const activeTab = ref('import');

const selectedFile = ref(null);
const isUploading = ref(false);
const importMessage = ref('');
const importErrors = ref([]);

const restoreJsonData = ref(null);
const restoreConfirmText = ref('');
const isRestoring = ref(false);

const auditLogs = ref([]);

const onFileSelected = (e) => {
  selectedFile.value = e.target.files[0] || null;
  importMessage.value = '';
  importErrors.value = [];
};

const uploadCsv = async () => {
  if (!selectedFile.value) return;
  isUploading.value = true;
  importMessage.value = '';
  importErrors.value = [];

  const formData = new FormData();
  formData.append('file', selectedFile.value);

  try {
    const res = await fetch('/api/import/requirements', {
      method: 'POST',
      headers: auth.authHeaders(),
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      if (data.errors) {
        importErrors.value = data.errors;
      }
      throw new Error(data.error || 'Gagal memproses impor CSV.');
    }

    importMessage.value = data.message;
    selectedFile.value = null;
  } catch (err) {
    if (importErrors.value.length === 0) {
      alert(err.message);
    }
  } finally {
    isUploading.value = false;
  }
};

const downloadTemplate = () => {
  const csvContent = "brand,model,variant,year_start,year_end,position,bolt_code,quantity,side,is_optional,notes\n" +
    "Honda,Vario,160 CBS/ABS,2022,2026,Cover Crankcase Kiri / CVT,HEX-M6-25-FL,8,LEFT,false,Bak CVT luar\n" +
    "Yamaha,NMAX,155 Connected,2020,2024,Kaliper Cakram Depan,HEX-M8-30-FL,2,FRONT,false,Baut bracket kaliper\n";
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'template_spesifikasi_baut_hextitanium.csv');
  link.click();
};

const downloadBackup = async () => {
  try {
    const res = await fetch('/api/admin/backup', { headers: auth.authHeaders() });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hextitanium_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  } catch (err) {
    alert('Gagal mengunduh cadangan database.');
  }
};

const onRestoreFileSelected = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      restoreJsonData.value = JSON.parse(event.target.result);
    } catch (err) {
      alert('File JSON tidak valid.');
    }
  };
  reader.readAsText(file);
};

const executeRestore = async () => {
  if (!restoreJsonData.value || restoreConfirmText.value !== 'RESTORE_HEXTITANIUM') return;
  isRestoring.value = true;
  try {
    const res = await fetch('/api/admin/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...auth.authHeaders() },
      body: JSON.stringify({
        backupData: restoreJsonData.value,
        confirmation: restoreConfirmText.value,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    alert(data.message);
    restoreJsonData.value = null;
    restoreConfirmText.value = '';
  } catch (err) {
    alert(err.message);
  } finally {
    isRestoring.value = false;
  }
};

const loadAuditLogs = async () => {
  try {
    const res = await fetch('/api/audit-logs', { headers: auth.authHeaders() });
    auditLogs.value = await res.json();
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  if (auth.isAdmin) {
    loadAuditLogs();
  }
});
</script>
