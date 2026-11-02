<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="bg-white dark:bg-[#121215] rounded-2xl p-5 sm:p-6 border border-zinc-200/80 dark:border-zinc-800/90 shadow-sm transition-colors">
      <div class="flex items-center space-x-2 mb-1">
        <span class="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
        <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
          Dokumentasi
        </span>
      </div>
      <h1 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Panduan Operasional Sistem Baut Hex Titanium
      </h1>
      <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
        Standar Prosedur Operasional (SOP) bagi staf gerai dan pemilik dalam mengoperasikan basis data baut dan otomasi pick-list.
      </p>
    </div>

    <!-- Quick Navigation Index -->
    <div class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 p-5 shadow-sm transition-colors">
      <h3 class="text-[10px] font-mono uppercase text-zinc-400 mb-2.5">Daftar Isi SOP:</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs font-medium">
        <a href="#sop-layanan" class="text-zinc-600 dark:text-zinc-300 hover:text-white flex items-center space-x-1.5">
          <span>&bull;</span> <span>1. Alur Layanan Gerai</span>
        </a>
        <a href="#sop-picklist" class="text-zinc-600 dark:text-zinc-300 hover:text-white flex items-center space-x-1.5">
          <span>&bull;</span> <span>2. Fitur Pick-List</span>
        </a>
        <a href="#sop-checklist" class="text-zinc-600 dark:text-zinc-300 hover:text-white flex items-center space-x-1.5">
          <span>&bull;</span> <span>3. Prosedur Checklist</span>
        </a>
        <a href="#sop-missing-data" class="text-zinc-600 dark:text-zinc-300 hover:text-white flex items-center space-x-1.5">
          <span>&bull;</span> <span>4. Motor Belum Terdata</span>
        </a>
        <a href="#sop-backup" class="text-zinc-600 dark:text-zinc-300 hover:text-white flex items-center space-x-1.5">
          <span>&bull;</span> <span>5. Backup & Restore</span>
        </a>
        <a href="#sop-evaluasi" class="text-zinc-600 dark:text-zinc-300 hover:text-white flex items-center space-x-1.5">
          <span>&bull;</span> <span>6. Target & Evaluasi</span>
        </a>
      </div>
    </div>

    <!-- Section 1 -->
    <section id="sop-layanan" class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 p-5 sm:p-6 shadow-sm transition-colors space-y-3">
      <h2 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
        <span>1. Standar Operasional Layanan Gerai (SOP)</span>
      </h2>
      <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
        Sebelum sistem ini dibuat, staf harus melepas dan mengukur baut satu per satu menggunakan jangka sorong (skitmat) yang memakan waktu hingga ±2 jam per motor full bike. Alur kerja baru dirancang sebagai berikut:
      </p>

      <ol class="list-decimal list-inside space-y-2 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
        <li><strong>Sapa Pelanggan:</strong> Tanyakan tipe motor, tahun pembuatan, dan kebutuhan variasi (satuan, paket mesin, pengereman, atau full bike).</li>
        <li><strong>Buka Sistem di Komputer / Ponsel:</strong> Akses menu <em>Ambil Baut</em> pada peramban web kasir atau ponsel staf via Wi-Fi gerai.</li>
        <li><strong>Pilih Tipe Motor:</strong> Pilih motor dari daftar (tersedia 20 tipe motor terpopuler seperti NMAX, Vario 160, Aerox, PCX, Beat, ZX-25R).</li>
        <li><strong>Tampilkan Daftar Baut:</strong> Sistem langsung menampilkan jumlah dan kode ukuran baut tanpa perlu mengukur fisik motor.</li>
        <li><strong>Catat Transaksi:</strong> Catat pembayaran di aplikasi kasir <em>Kelola</em> (sistem ini khusus untuk spesifikasi dan penyiapan teknis).</li>
      </ol>
    </section>

    <!-- Section 2 -->
    <section id="sop-picklist" class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 p-5 sm:p-6 shadow-sm transition-colors space-y-3">
      <h2 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
        2. Penggunaan Fitur Pick-List Otomatis
      </h2>
      <div class="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
        <p>Sistem menyediakan dua cara pengelompokan yang saling melengkapi:</p>
        <ul class="list-disc list-inside space-y-1 pl-2 text-zinc-700 dark:text-zinc-300">
          <li>
            <strong>Ringkasan Ukuran Rak (Consolidated Totals):</strong> Menghitung total baut per kode spesifikasi di seluruh titik motor. Contoh: Jika baut M6×25 digunakan 6 pcs di CVT dan 5 pcs di crankcase kanan, sistem langsung menampilkan total 11 pcs agar staf cukup mengambilnya 1 kali dari rak penyimpanan.
          </li>
          <li>
            <strong>Rincian Titik Pasang (Position Breakdown):</strong> Memberikan panduan posisi presisi (Kiri, Kanan, Depan, Belakang) untuk teknisi saat memasang baut ke motor pelanggan.
          </li>
        </ul>
      </div>
    </section>

    <!-- Section 3 -->
    <section id="sop-checklist" class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 p-5 sm:p-6 shadow-sm transition-colors space-y-3">
      <h2 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
        3. Prosedur Pengambilan & Checklist Staf
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
        <div class="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800">
          <p class="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. Buka Sesi</p>
          <p class="text-zinc-400 text-[11px]">Klik "Mulai Checklist" pada halaman pick-list.</p>
        </div>
        <div class="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800">
          <p class="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. Ambil & Centang</p>
          <p class="text-zinc-400 text-[11px]">Ambil baut dari rak sesuai kuantitas, lalu ketuk baris untuk menandai centang.</p>
        </div>
        <div class="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800">
          <p class="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. Selesai</p>
          <p class="text-zinc-400 text-[11px]">Saat 100% lengkap, sistem memberi status "Selesai" tanda siap diserahkan.</p>
        </div>
      </div>
    </section>

    <!-- Section 4 -->
    <section id="sop-missing-data" class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 p-5 sm:p-6 shadow-sm transition-colors space-y-3">
      <h2 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
        4. Penanganan Motor Belum Terdata / Custom
      </h2>
      <div class="p-4 rounded-xl bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 space-y-2">
        <p class="font-bold text-zinc-900 dark:text-zinc-100">Bila pelanggan datang membawa motor yang belum terdata dalam sistem:</p>
        <ol class="list-decimal list-inside space-y-1 text-[11px]">
          <li>Ukur baut bagian yang diminta menggunakan jangka sorong presisi.</li>
          <li>Catat ukuran (Diameter × Panjang, tipe kepala, kuantitas, dan posisi).</li>
          <li>Admin / Teknisi memasukkan data tersebut ke menu <em>Tipe Motor &rarr; Matriks Baut</em>.</li>
          <li>Data tersimpan permanen sehingga pelanggan berikutnya tidak perlu diukur manual lagi.</li>
        </ol>
      </div>
    </section>

    <!-- Section 5 -->
    <section id="sop-backup" class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 p-5 sm:p-6 shadow-sm transition-colors space-y-3">
      <h2 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
        5. Prosedur Backup & Restore Offline
      </h2>
      <p class="text-xs text-zinc-500 dark:text-zinc-400">
        Karena sistem berjalan di komputer lokal gerai (tanpa biaya cloud server), pencadangan rutin ke Flashdisk toko sangat penting:
      </p>
      <ul class="list-disc list-inside space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
        <li><strong>Rutin Setiap Sore:</strong> Masuk sebagai Admin &rarr; menu <em>Admin &rarr; Backup & Restore</em> &rarr; klik <strong>Unduh Cadangan Basis Data (.JSON)</strong>.</li>
        <li><strong>Simpan ke Flashdisk USB:</strong> Salin file cadangan ke flashdisk gerai Hex Titanium.</li>
        <li><strong>Pemulihan:</strong> Buka menu Restore, pilih file JSON, ketik <code>RESTORE_HEXTITANIUM</code>, dan konfirmasi.</li>
      </ul>
    </section>

    <!-- Section 6 -->
    <section id="sop-evaluasi" class="bg-white dark:bg-[#121215] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 p-5 sm:p-6 shadow-sm transition-colors space-y-3">
      <h2 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
        6. Kriteria Keberhasilan & Evaluasi Program 1
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div class="p-4 rounded-xl bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800">
          <p class="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Target Waktu Layanan:</p>
          <p class="text-zinc-400 text-[11px]">Baseline: ±120 menit per motor full bike. Target setelah sistem: berkurang minimal 50% (&lt;60 menit, penyiapan baut hanya 5–10 menit).</p>
        </div>
        <div class="p-4 rounded-xl bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800">
          <p class="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Kemandirian Staf Toko:</p>
          <p class="text-zinc-400 text-[11px]">Minimal 2 karyawan gerai mampu melayani pelanggan dan menyiapkan baut secara mandiri tanpa bantuan pemilik.</p>
        </div>
      </div>
    </section>
  </div>
</template>
