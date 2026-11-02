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
          Manajemen pengguna dinamis, konfigurasi peran & hak akses RBAC, impor CSV massal, dan cadangan offline
        </p>
      </div>

      <!-- Segmented Navigation Tabs -->
      <div class="inline-flex p-1 bg-zinc-100 dark:bg-[#18181c] rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
        <button
          @click="activeTab = 'users'"
          class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap"
          :class="[activeTab === 'users' ? 'bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 font-semibold shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200']"
        >
          Pengguna & RBAC
        </button>
        <button
          @click="activeTab = 'import'"
          class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap"
          :class="[activeTab === 'import' ? 'bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 font-semibold shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200']"
        >
          Impor CSV
        </button>
        <button
          @click="activeTab = 'backup'"
          class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap"
          :class="[activeTab === 'backup' ? 'bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 font-semibold shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200']"
        >
          Backup & Restore
        </button>
        <button
          @click="activeTab = 'audit'"
          class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap"
          :class="[activeTab === 'audit' ? 'bg-white dark:bg-[#121215] text-zinc-900 dark:text-zinc-100 font-semibold shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200']"
        >
          Audit Log
        </button>
      </div>
    </div>

    <!-- TAB 1: USER MANAGEMENT & DYNAMIC RBAC -->
    <div v-if="activeTab === 'users'" class="space-y-6">
      <!-- Sub-Tab Switcher: Accounts vs Roles & Access -->
      <div class="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <button
          @click="userSubTab = 'accounts'"
          class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
          :class="[userSubTab === 'accounts' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-sm' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200']"
        >
          Daftar Pengguna ({{ users.length }})
        </button>
        <button
          @click="userSubTab = 'roles'"
          class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5"
          :class="[userSubTab === 'roles' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-sm' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200']"
        >
          <span>Kelola Peran & Hak Akses (RBAC)</span>
          <span class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            {{ roles.length }}
          </span>
        </button>
      </div>

      <!-- SUB-TAB 1: ACCOUNTS LIST -->
      <div v-if="userSubTab === 'accounts'" class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm overflow-hidden transition-colors">
        <div class="p-5 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Daftar Akun Pengguna Gerai
            </h3>
            <p class="text-xs text-zinc-400 mt-0.5">
              Kelola kredensial staf, teknisi bengkel, dan administrator gerai Hex Titanium
            </p>
          </div>

          <div class="flex items-center space-x-2">
            <input
              v-model="userSearch"
              type="text"
              placeholder="Cari user atau nama..."
              class="px-3 py-1.5 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
            />
            <button
              @click="openAddUserModal"
              type="button"
              class="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer shrink-0"
            >
              <span>+</span>
              <span>Tambah User</span>
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
                <th class="py-3 px-4 font-normal">Pengguna</th>
                <th class="py-3 px-4 font-normal">Role / Peran</th>
                <th class="py-3 px-4 font-normal">Status</th>
                <th class="py-3 px-4 font-normal text-center">Sesi Ambil Baut</th>
                <th class="py-3 px-4 font-normal">Tanggal Dibuat</th>
                <th class="py-3 px-4 font-normal text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              <tr v-for="u in filteredUsers" :key="u.id" class="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors">
                <td class="py-3 px-4">
                  <div class="flex items-center space-x-2.5">
                    <div class="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-xs uppercase text-zinc-700 dark:text-zinc-300">
                      {{ u.username.slice(0, 2) }}
                    </div>
                    <div>
                      <p class="font-bold text-zinc-900 dark:text-zinc-100 font-mono text-xs">{{ u.username }}</p>
                      <p class="text-[11px] text-zinc-400">{{ u.name }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span
                    class="px-2 py-0.5 rounded font-mono text-[10px] border"
                    :class="[
                      u.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      u.role === 'TECHNICIAN' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    ]"
                  >
                    {{ u.roleRel?.displayName || u.role }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span
                    class="px-2 py-0.5 text-[9px] font-mono rounded border"
                    :class="[u.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20']"
                  >
                    {{ u.isActive ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </td>
                <td class="py-3 px-4 text-center font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  <span class="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-[10px] border border-zinc-200 dark:border-zinc-700">
                    {{ u._count?.pickSessions || 0 }} sesi
                  </span>
                </td>
                <td class="py-3 px-4 font-mono text-zinc-400 text-[11px]">
                  {{ formatDateTime(u.createdAt) }}
                </td>
                <td class="py-3 px-4 text-right space-x-2">
                  <button
                    @click="openEditUserModal(u)"
                    type="button"
                    class="text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white underline font-medium cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    v-if="u.id !== auth.user?.id"
                    @click="toggleUserStatus(u)"
                    type="button"
                    class="text-xs font-medium cursor-pointer"
                    :class="[u.isActive ? 'text-amber-500 hover:text-amber-400' : 'text-emerald-500 hover:text-emerald-400']"
                  >
                    {{ u.isActive ? 'Nonaktifkan' : 'Aktifkan' }}
                  </button>
                  <button
                    v-if="u.id !== auth.user?.id"
                    @click="deleteUser(u)"
                    type="button"
                    class="text-xs text-rose-500 hover:text-rose-400 font-medium cursor-pointer"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- SUB-TAB 2: DYNAMIC ROLES & ACCESS CONTROL -->
      <div v-if="userSubTab === 'roles'" class="space-y-5">
        <div class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm p-5 sm:p-6 transition-colors">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div class="flex items-center space-x-2 mb-1">
                <span class="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Dynamic RBAC</span>
              </div>
              <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Daftar Peran (Roles) & Izin Akses Kustom
              </h3>
              <p class="text-xs text-zinc-400 mt-0.5">
                Anda dapat membuat peran baru bebas dan mengatur perizinan fitur secara dinamis (non-hardcoded)
              </p>
            </div>

            <button
              @click="openCreateRoleModal"
              type="button"
              class="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer shrink-0"
            >
              <span>+</span>
              <span>Buat Role Baru</span>
            </button>
          </div>

          <!-- Roles Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="r in roles"
              :key="r.id"
              class="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#18181c]/50 flex flex-col justify-between space-y-3"
            >
              <div>
                <div class="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <h4 class="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                      {{ r.displayName }}
                    </h4>
                    <span class="text-[10px] font-mono text-zinc-400">{{ r.name }}</span>
                  </div>
                  <span
                    class="text-[9px] font-mono px-2 py-0.5 rounded border"
                    :class="[r.isSystem ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-zinc-800 text-zinc-300 border-zinc-700']"
                  >
                    {{ r.isSystem ? 'Sistem' : 'Kustom' }}
                  </span>
                </div>

                <p class="text-[11px] text-zinc-500 dark:text-zinc-400 min-h-[32px] line-clamp-2">
                  {{ r.description || 'Tidak ada deskripsi peran.' }}
                </p>

                <!-- Permissions Count & Pills -->
                <div class="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div class="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1.5">
                    <span>Izin Akses Aktif</span>
                    <span class="text-zinc-900 dark:text-zinc-200 font-bold">
                      {{ r.permissions.length }} / {{ allPermissions.length }}
                    </span>
                  </div>
                  <div class="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                    <span
                      v-for="p in r.permissions"
                      :key="p.id"
                      class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    >
                      {{ p.name }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                <span class="text-[11px] text-zinc-400 font-mono">
                  {{ r.userCount }} pengguna
                </span>

                <div class="space-x-2">
                  <button
                    @click="openEditRoleModal(r)"
                    type="button"
                    class="text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white font-medium underline cursor-pointer"
                  >
                    Ubah Izin
                  </button>
                  <button
                    v-if="!r.isSystem"
                    @click="deleteRole(r)"
                    type="button"
                    class="text-xs text-rose-500 hover:text-rose-400 font-medium cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: CSV IMPORT -->
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

          <div class="flex items-center justify-between pt-1">
            <button
              @click="downloadTemplate"
              type="button"
              class="text-xs text-zinc-400 hover:text-zinc-200 underline font-mono"
            >
              Unduh Template CSV
            </button>

            <button
              @click="uploadCsv"
              :disabled="!selectedFile || isUploading"
              type="button"
              class="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-40"
            >
              <span v-if="isUploading">Memproses...</span>
              <span v-else>Proses Impor CSV</span>
            </button>
          </div>

          <div v-if="importMessage" class="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-medium">
            {{ importMessage }}
          </div>

          <div v-if="importErrors.length > 0" class="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl space-y-1">
            <p class="font-bold">Gagal mengimpor karena kesalahan data baris:</p>
            <ul class="list-disc list-inside text-[11px] space-y-0.5">
              <li v-for="(err, idx) in importErrors" :key="idx">{{ err }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="md:col-span-6 bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 p-5 sm:p-6 shadow-sm transition-colors">
        <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Format Struktur Kolom CSV
        </h3>
        <p class="text-xs text-zinc-400 mb-4 leading-relaxed">
          File CSV harus memiliki tajuk kolom (*header*) tepat sesuai dengan ketentuan di bawah ini:
        </p>

        <div class="space-y-2 text-xs font-mono">
          <div class="p-2.5 rounded-lg bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800">
            <span class="text-zinc-900 dark:text-zinc-100 font-bold">brand</span>
            <span class="text-zinc-500 ml-2">Merek (Honda, Yamaha, Suzuki, Kawasaki)</span>
          </div>
          <div class="p-2.5 rounded-lg bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800">
            <span class="text-zinc-900 dark:text-zinc-100 font-bold">model, variant</span>
            <span class="text-zinc-500 ml-2">Nama model (e.g. NMAX) & varian (155 Connected)</span>
          </div>
          <div class="p-2.5 rounded-lg bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800">
            <span class="text-zinc-900 dark:text-zinc-100 font-bold">year_start, year_end</span>
            <span class="text-zinc-500 ml-2">Tahun rilis (e.g. 2020 & 2024)</span>
          </div>
          <div class="p-2.5 rounded-lg bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800">
            <span class="text-zinc-900 dark:text-zinc-100 font-bold">position</span>
            <span class="text-zinc-500 ml-2">Nama titik pasang (e.g. Cover Crankcase Kiri / CVT)</span>
          </div>
          <div class="p-2.5 rounded-lg bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800">
            <span class="text-zinc-900 dark:text-zinc-100 font-bold">bolt_code, quantity</span>
            <span class="text-zinc-500 ml-2">Kode baut master (HEX-M6-25-FL) & kuantitas</span>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: BACKUP & RESTORE -->
    <div v-if="activeTab === 'backup'" class="grid grid-cols-1 md:grid-cols-12 gap-5">
      <div class="md:col-span-6 bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 p-5 sm:p-6 shadow-sm transition-colors">
        <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          Pencadangan Database Offline (Backup)
        </h3>
        <p class="text-xs text-zinc-400 mb-4">
          Ekspor seluruh data spesifikasi baut, tipe motor, akun, dan paket bundling ke file JSON terenkripsi untuk disimpan ke flashdisk toko setiap sore.
        </p>

        <button
          @click="downloadBackup"
          type="button"
          class="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          <span>Unduh Berkas Cadangan (.json)</span>
        </button>
      </div>

      <div class="md:col-span-6 bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 p-5 sm:p-6 shadow-sm transition-colors space-y-4">
        <div>
          <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            Pemulihan Data (Restore)
          </h3>
          <p class="text-xs text-zinc-400">
            Pulihkan data sistem dari file JSON cadangan. Tindakan ini akan menggantikan data yang ada dengan proteksi konfirmasi ganda.
          </p>
        </div>

        <input
          type="file"
          accept=".json"
          @change="onRestoreFileSelected"
          class="block w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 dark:file:bg-zinc-800 file:text-zinc-900 dark:file:text-zinc-100 cursor-pointer"
        />

        <div v-if="restoreJsonData" class="space-y-3 pt-2">
          <p class="text-xs text-amber-500 font-medium">
            Ketik <span class="font-mono font-bold">RESTORE_HEXTITANIUM</span> untuk mengonfirmasi pemulihan:
          </p>
          <input
            v-model="restoreConfirmText"
            type="text"
            placeholder="Ketik RESTORE_HEXTITANIUM..."
            class="w-full px-3 py-2 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
          />
          <button
            @click="executeRestore"
            :disabled="restoreConfirmText !== 'RESTORE_HEXTITANIUM' || isRestoring"
            type="button"
            class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-40"
          >
            <span v-if="isRestoring">Memulihkan Data...</span>
            <span v-else>Eksekusi Pemulihan Database</span>
          </button>
        </div>
      </div>
    </div>

    <!-- TAB 4: AUDIT LOG -->
    <div v-if="activeTab === 'audit'" class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm overflow-hidden transition-colors">
      <div class="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Riwayat Aktivitas & Audit Keamanan
          </h3>
          <p class="text-xs text-zinc-400 mt-0.5">
            Merekam setiap penambahan, pembaruan, login pengguna, dan operasi impor/ekspor
          </p>
        </div>
        <button
          @click="loadAuditLogs"
          class="text-xs text-zinc-400 hover:text-zinc-200 underline font-mono"
        >
          Muat Ulang
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

    <!-- MODAL 1: TAMBAH PENGGUNA BARU (DYNAMIC ROLE SELECTION) -->
    <div
      v-if="isAddUserModalOpen"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-white dark:bg-[#121215] rounded-2xl max-w-md w-full shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div class="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Tambah Pengguna Baru</h3>
          <button @click="isAddUserModalOpen = false" class="text-zinc-400 hover:text-zinc-200 text-xs">✕</button>
        </div>

        <form @submit.prevent="submitCreateUser" class="p-5 space-y-3.5 text-xs">
          <div>
            <label class="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Username (Login ID)</label>
            <input
              v-model="newUserForm.username"
              type="text"
              required
              placeholder="e.g. staf_budi"
              class="w-full px-3 py-2 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 font-mono"
            />
          </div>

          <div>
            <label class="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Nama Lengkap</label>
            <input
              v-model="newUserForm.name"
              type="text"
              required
              placeholder="e.g. Budi Santoso"
              class="w-full px-3 py-2 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label class="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Role / Peran Akses (Dinamis dari Database)</label>
            <select
              v-model="newUserForm.roleId"
              required
              class="w-full px-3 py-2 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
            >
              <option v-for="r in roles" :key="r.id" :value="r.id">
                {{ r.displayName }} ({{ r.name }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Kata Sandi (Minimal 6 Karakter)</label>
            <input
              v-model="newUserForm.password"
              type="password"
              required
              minlength="6"
              placeholder="••••••••"
              class="w-full px-3 py-2 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              @click="isAddUserModalOpen = false"
              type="button"
              class="px-3 py-1.5 text-zinc-400 hover:text-zinc-200 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isSubmittingUser"
              class="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold rounded-xl disabled:opacity-50"
            >
              <span v-if="isSubmittingUser">Menyimpan...</span>
              <span v-else>Simpan Pengguna</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL 2: EDIT PENGGUNA -->
    <div
      v-if="selectedUserForEdit"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-white dark:bg-[#121215] rounded-2xl max-w-md w-full shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div class="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Ubah Data Pengguna</h3>
            <p class="text-[11px] font-mono text-zinc-400">@{{ selectedUserForEdit.username }}</p>
          </div>
          <button @click="selectedUserForEdit = null" class="text-zinc-400 hover:text-zinc-200 text-xs">✕</button>
        </div>

        <form @submit.prevent="submitEditUser" class="p-5 space-y-3.5 text-xs">
          <div>
            <label class="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Nama Lengkap</label>
            <input
              v-model="editUserForm.name"
              type="text"
              required
              class="w-full px-3 py-2 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label class="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Role / Peran Akses</label>
            <select
              v-model="editUserForm.roleId"
              required
              class="w-full px-3 py-2 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
            >
              <option v-for="r in roles" :key="r.id" :value="r.id">
                {{ r.displayName }} ({{ r.name }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Reset Kata Sandi (Kosongkan bila tidak diubah)</label>
            <input
              v-model="editUserForm.password"
              type="password"
              minlength="6"
              placeholder="Masukkan password baru jika ingin mengubah..."
              class="w-full px-3 py-2 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              @click="selectedUserForEdit = null"
              type="button"
              class="px-3 py-1.5 text-zinc-400 hover:text-zinc-200 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isSubmittingUser"
              class="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold rounded-xl disabled:opacity-50"
            >
              <span v-if="isSubmittingUser">Menyimpan...</span>
              <span v-else>Perbarui Data</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL 3: BUAT / UBAH ROLE & HAK AKSES DINAMIS (NON-HARDCODED) -->
    <div
      v-if="isRoleModalOpen"
      class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      <div class="bg-white dark:bg-[#121215] rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <span class="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Dynamic RBAC Role Editor</span>
            <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
              {{ editingRoleId ? `Ubah Hak Akses: ${roleForm.name}` : 'Buat Role Baru & Atur Hak Akses' }}
            </h3>
          </div>
          <button @click="isRoleModalOpen = false" class="text-zinc-400 hover:text-zinc-200 text-xs">✕</button>
        </div>

        <form @submit.prevent="submitSaveRole" class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Kode Role (Huruf Besar & Garis Bawah)</label>
              <input
                v-model="roleForm.name"
                :disabled="Boolean(editingRoleId)"
                type="text"
                required
                placeholder="e.g. SUPERVISOR_GUDANG"
                class="w-full px-3 py-2 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500 font-mono disabled:opacity-50"
              />
            </div>

            <div>
              <label class="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Nama Tampilan Role</label>
              <input
                v-model="roleForm.displayName"
                type="text"
                required
                placeholder="e.g. Supervisor Gudang & Logistik"
                class="w-full px-3 py-2 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Deskripsi Wewenang</label>
            <input
              v-model="roleForm.description"
              type="text"
              placeholder="Jelaskan ruang lingkup tugas peran ini di gerai Hex Titanium..."
              class="w-full px-3 py-2 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <!-- Permissions Granular Checkboxes -->
          <div class="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  Daftar Hak Akses Fitur (Pilih yang Diizinkan)
                </span>
                <p class="text-[11px] text-zinc-400">
                  {{ roleForm.permissionCodes.length }} dari {{ allPermissions.length }} izin dipilih
                </p>
              </div>

              <div class="space-x-1.5">
                <button
                  @click="selectAllPermissions"
                  type="button"
                  class="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                >
                  Pilih Semua
                </button>
                <button
                  @click="deselectAllPermissions"
                  type="button"
                  class="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                >
                  Kosongkan
                </button>
              </div>
            </div>

            <!-- Grouped Permissions -->
            <div class="space-y-3">
              <div
                v-for="(perms, category) in groupedPermissions"
                :key="category"
                class="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#18181c]/50 space-y-2"
              >
                <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">
                  {{ category }}
                </span>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label
                    v-for="p in perms"
                    :key="p.code"
                    class="flex items-start space-x-2.5 p-2 rounded-lg hover:bg-zinc-100/60 dark:hover:bg-zinc-800/50 cursor-pointer select-none transition-colors border"
                    :class="[
                      roleForm.permissionCodes.includes(p.code)
                        ? 'border-emerald-500/30 bg-emerald-500/5 text-zinc-900 dark:text-zinc-100'
                        : 'border-transparent text-zinc-500 dark:text-zinc-400'
                    ]"
                  >
                    <input
                      type="checkbox"
                      :value="p.code"
                      v-model="roleForm.permissionCodes"
                      class="mt-0.5 rounded text-zinc-900 focus:ring-0 cursor-pointer"
                    />
                    <div class="min-w-0">
                      <p class="text-xs font-medium leading-tight">{{ p.name }}</p>
                      <p class="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">{{ p.description }}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              @click="isRoleModalOpen = false"
              type="button"
              class="px-3.5 py-2 text-zinc-400 hover:text-zinc-200 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isSubmittingRole"
              class="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold rounded-xl disabled:opacity-50"
            >
              <span v-if="isSubmittingRole">Menyimpan Role...</span>
              <span v-else>{{ editingRoleId ? 'Simpan Perubahan Izin' : 'Buat Role Baru' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { formatDateTime } from '../utils/date';

const auth = useAuthStore();
const activeTab = ref('users');
const userSubTab = ref('accounts');

// User Management state
const users = ref([]);
const userSearch = ref('');
const isAddUserModalOpen = ref(false);
const selectedUserForEdit = ref(null);
const isSubmittingUser = ref(false);

const newUserForm = ref({
  username: '',
  password: '',
  name: '',
  roleId: null,
});

const editUserForm = ref({
  name: '',
  roleId: null,
  password: '',
});

// Dynamic Roles & Permissions state
const roles = ref([]);
const allPermissions = ref([]);
const isRoleModalOpen = ref(false);
const editingRoleId = ref(null);
const isSubmittingRole = ref(false);

const roleForm = ref({
  name: '',
  displayName: '',
  description: '',
  permissionCodes: [],
});

const groupedPermissions = computed(() => {
  const map = {};
  for (const p of allPermissions.value) {
    if (!map[p.category]) map[p.category] = [];
    map[p.category].push(p);
  }
  return map;
});

const filteredUsers = computed(() => {
  if (!userSearch.value.trim()) return users.value;
  const q = userSearch.value.toLowerCase();
  return users.value.filter((u) =>
    u.username.toLowerCase().includes(q) ||
    u.name.toLowerCase().includes(q) ||
    u.role.toLowerCase().includes(q) ||
    u.roleRel?.displayName?.toLowerCase().includes(q)
  );
});

const loadUsers = async () => {
  try {
    const res = await fetch('/api/users', { headers: auth.authHeaders() });
    if (res.ok) {
      users.value = await res.json();
    }
  } catch (err) {
    console.error('Failed to load users:', err);
  }
};

const loadRolesAndPermissions = async () => {
  try {
    const [resRoles, resPerms] = await Promise.all([
      fetch('/api/roles', { headers: auth.authHeaders() }),
      fetch('/api/roles/permissions', { headers: auth.authHeaders() }),
    ]);

    if (resRoles.ok) {
      roles.value = await resRoles.json();
    }
    if (resPerms.ok) {
      allPermissions.value = await resPerms.json();
    }
  } catch (err) {
    console.error('Failed to load roles and permissions:', err);
  }
};

const openAddUserModal = () => {
  const defaultRole = roles.value.find((r) => r.name === 'STAFF') || roles.value[0];
  newUserForm.value = {
    username: '',
    password: '',
    name: '',
    roleId: defaultRole ? defaultRole.id : null,
  };
  isAddUserModalOpen.value = true;
};

const submitCreateUser = async () => {
  if (isSubmittingUser.value) return;
  isSubmittingUser.value = true;
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...auth.authHeaders() },
      body: JSON.stringify(newUserForm.value),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal membuat pengguna.');

    isAddUserModalOpen.value = false;
    await loadUsers();
    await loadRolesAndPermissions();
    await loadAuditLogs();
  } catch (err) {
    alert(err.message);
  } finally {
    isSubmittingUser.value = false;
  }
};

const openEditUserModal = (u) => {
  selectedUserForEdit.value = u;
  editUserForm.value = {
    name: u.name,
    roleId: u.roleId || (roles.value.find((r) => r.name === u.role)?.id || null),
    password: '',
  };
};

const submitEditUser = async () => {
  if (!selectedUserForEdit.value || isSubmittingUser.value) return;
  isSubmittingUser.value = true;
  try {
    const body = {
      name: editUserForm.value.name,
      roleId: editUserForm.value.roleId,
    };
    if (editUserForm.value.password.trim()) {
      body.password = editUserForm.value.password.trim();
    }

    const res = await fetch(`/api/users/${selectedUserForEdit.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...auth.authHeaders() },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengubah pengguna.');

    selectedUserForEdit.value = null;
    await loadUsers();
    await loadRolesAndPermissions();
    await loadAuditLogs();
  } catch (err) {
    alert(err.message);
  } finally {
    isSubmittingUser.value = false;
  }
};

const toggleUserStatus = async (u) => {
  const actionText = u.isActive ? 'menonaktifkan' : 'mengaktifkan';
  if (!confirm(`Apakah Anda yakin ingin ${actionText} akun @${u.username}?`)) return;

  try {
    const res = await fetch(`/api/users/${u.id}/status`, {
      method: 'PATCH',
      headers: auth.authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengubah status.');

    u.isActive = data.isActive;
    await loadAuditLogs();
  } catch (err) {
    alert(err.message);
  }
};

const deleteUser = async (u) => {
  if (!confirm(`Hapus akun @${u.username}? Bila pengguna memiliki riwayat sesi pengambilan baut, akun akan dinonaktifkan demi keutuhan data.`)) return;

  try {
    const res = await fetch(`/api/users/${u.id}`, {
      method: 'DELETE',
      headers: auth.authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menghapus pengguna.');

    if (data.message) alert(data.message);
    await loadUsers();
    await loadRolesAndPermissions();
    await loadAuditLogs();
  } catch (err) {
    alert(err.message);
  }
};

// Role & Permission Management handlers
const openCreateRoleModal = () => {
  editingRoleId.value = null;
  roleForm.value = {
    name: '',
    displayName: '',
    description: '',
    permissionCodes: ['PICKLIST_GENERATE', 'SESSION_CHECKLIST'],
  };
  isRoleModalOpen.value = true;
};

const openEditRoleModal = (role) => {
  editingRoleId.value = role.id;
  roleForm.value = {
    name: role.name,
    displayName: role.displayName,
    description: role.description || '',
    permissionCodes: [...(role.permissionCodes || [])],
  };
  isRoleModalOpen.value = true;
};

const selectAllPermissions = () => {
  roleForm.value.permissionCodes = allPermissions.value.map((p) => p.code);
};

const deselectAllPermissions = () => {
  roleForm.value.permissionCodes = [];
};

const submitSaveRole = async () => {
  if (isSubmittingRole.value) return;
  isSubmittingRole.value = true;
  try {
    let res;
    if (editingRoleId.value) {
      res = await fetch(`/api/roles/${editingRoleId.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...auth.authHeaders() },
        body: JSON.stringify({
          displayName: roleForm.value.displayName,
          description: roleForm.value.description,
          permissionCodes: roleForm.value.permissionCodes,
        }),
      });
    } else {
      res = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...auth.authHeaders() },
        body: JSON.stringify({
          name: roleForm.value.name,
          displayName: roleForm.value.displayName,
          description: roleForm.value.description,
          permissionCodes: roleForm.value.permissionCodes,
        }),
      });
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menyimpan role.');

    isRoleModalOpen.value = false;
    await loadRolesAndPermissions();
    await loadUsers();
    await loadAuditLogs();
  } catch (err) {
    alert(err.message);
  } finally {
    isSubmittingRole.value = false;
  }
};

const deleteRole = async (role) => {
  if (!confirm(`Hapus role kustom "${role.displayName}" (${role.name})?`)) return;

  try {
    const res = await fetch(`/api/roles/${role.id}`, {
      method: 'DELETE',
      headers: auth.authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menghapus role.');

    if (data.message) alert(data.message);
    await loadRolesAndPermissions();
    await loadAuditLogs();
  } catch (err) {
    alert(err.message);
  }
};

// Existing Import / Backup / Audit state
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
    await loadAuditLogs();
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
    await loadUsers();
    await loadRolesAndPermissions();
    await loadAuditLogs();
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
    loadUsers();
    loadRolesAndPermissions();
    loadAuditLogs();
  }
});
</script>
