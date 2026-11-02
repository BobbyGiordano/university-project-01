# Modul & Manual Operasional Sistem Spesifikasi Baut
## UMKM Hex Titanium — Program 1 Pengabdian Masyarakat Informatika FTI UAJY

---

## 1. Pendahuluan & Latar Belakang Masalah

Hex Titanium adalah UMKM yang berlokasi di Banguntapan, Bantul, D.I. Yogyakarta yang bergerak di bidang modifikasi baut titanium berwarna untuk sepeda motor melalui proses kimiawi (*anodizing*).

Sebelum penerapan sistem ini, gerai menghadapi kendala operasional yang kritis:
1. **Pengukuran Manual Satu per Satu:** Setiap kali pelanggan datang, staf harus melepas dan mengukur baut menggunakan jangka sorong (*skitmat*). Untuk satu unit motor *full bike* (150–180 baut), proses ini memakan waktu hingga **±2 jam per motor**.
2. **Ketergantungan pada Pemilik:** Pengetahuan ukuran dan kebutuhan baut hanya dikuasai oleh pemilik (Pak Aldi). Karyawan gerai belum dapat melayani secara mandiri.
3. **Antrean Panjang & Penurunan Reputasi:** Waktu tunggu yang lama memicu antrean menumpuk dan berujung pada ulasan bintang 1 di Google Maps.

Sistem lokal ini dibangun untuk mengatasi akar masalah tersebut dengan menyediakan basis data spesifikasi baut untuk **minimal 20 tipe motor terpopuler**, otomasi **daftar ambil baut (*pick-list*)**, dan **lembar kerja *checklist* interaktif**.

---

## 2. Arsitektur & Lingkungan Sistem

- **Sifat Sistem:** Berjalan secara mandiri di jaringan lokal toko (*localhost* / LAN Wi-Fi).
- **Kemandirian Biaya:** 100% bebas dari sewa server cloud, domain, maupun langganan SaaS berbayar.
- **Perangkat Keras:** Menggunakan komputer kasir gerai yang sudah ada.
- **Akses Pengguna:**
  - Komputer kasir gerai via peramban web: `http://localhost:3000`
  - Ponsel pintar staf via Wi-Fi toko: `http://<IP_KOMPUTER_KASIR>:3000`
- **Pemisahan dengan Aplikasi Kelola:** Aplikasi kasir *Kelola* tetap digunakan untuk transaksi keuangan dan struk belanja; sistem ini khusus menangani spesifikasi teknis dan otomasi penyiapan baut.

---

## 3. Akun Pengguna & Hak Akses

| Peran (Role) | Username Default | Password Default | Hak Akses |
|---|---|---|---|
| **Admin / Pemilik** | `admin` | `admin123` | Kelola master tipe motor, tambah/edit matriks kebutuhan baut, impor CSV, ekspor cadangan (backup), pemulihan (restore), kelola posisi baut & spesifikasi, lihat catatan audit. |
| **Staf Gerai** | `staff` | `staff123` | Cari tipe motor, buat daftar ambil baut otomatis, jalankan checklist interaktif, cetak lembar kerja pick-list. |

---

## 4. Standar Operasional Prosedur (SOP) Layanan

### SOP 1: Penyiapan Baut Pelanggan Datang
1. Sambut pelanggan dan tanyakan tipe motor, tahun rilis, dan area baut yang ingin diganti (Paket Mesin, Pengereman, Bodi, atau Full Bike).
2. Buka menu **📋 Ambil Baut**.
3. Pilih merek dan model motor dari daftar pilihan (tersedia 20+ motor populer).
4. Jika pelanggan memilih paket tertentu (misal: Paket Mesin NMAX 155), pilih paket tersebut pada kolom *Pilihan Paket*.
5. Klik tombol **Tampilkan**. Sistem akan secara instan menampilkan:
   - **Ringkasan Total Ukuran (Consolidated Totals):** Menunjukkan total baut per ukuran untuk diambil dari laci rak baut.
   - **Rincian Titik Pasang (Position Breakdown):** Menunjukkan posisi pemasangan (kiri/kanan/depan/belakang) untuk teknisi.
6. Klik **Mulai Checklist** untuk membuka sesi pengambilan interaktif di ponsel staf.
7. Ambil baut dari rak sesuai jumlah yang tertera, lalu ketuk baris baut untuk menandai centang (tersimpan otomatis).
8. Serahkan baut yang telah lengkap kepada teknisi atau pelanggan. Waktu penyiapan kini hanya **5–10 menit** (hemat >50% dari sebelumnya 120 menit).

---

### SOP 2: Menggunakan Mode Gelap / Terang (Dark & Light Mode)
- Pada bagian pojok kanan atas bilah menu (navbar), ketuk ikon **Matahari / Bulan**.
- **Mode Terang (Light Mode):** Direkomendasikan untuk meja kasir di area depan dengan pencahayaan terang.
- **Mode Gelap (Dark Mode):** Direkomendasikan untuk area bengkel / perakitan dalam ruangan agar kontras layar lebih nyaman bagi mata teknisi.
- Pilihan tema tersimpan otomatis di perangkat masing-masing.

---

### SOP 3: Penanganan Motor Belum Terdata dalam Sistem
Bila pelanggan membawa tipe motor yang belum ada dalam basis data:
1. Lakukan pengukuran manual dengan jangka sorong satu kali saja untuk bagian yang diminta.
2. Catat ukuran: diameter (M5/M6/M8/M10), panjang baut (mm), tipe kepala (Flange Hex/Button), jumlah, dan posisinya.
3. Masuk sebagai **Admin** &rarr; buka menu **🏍️ Tipe Motor & Spesifikasi**.
4. Buka motor tersebut &rarr; klik **Matriks Baut** &rarr; masukkan titik baut baru lalu simpan.
5. Mulai saat itu, motor tersebut telah tersimpan di sistem dan dapat diambil otomatis di kemudian hari.

---

### SOP 4: Cadangan Harian (Daily Backup) & Pemulihan (Restore)
Untuk mencegah kehilangan data jika komputer toko mengalami kendala teknis:
1. Setiap sore sebelum toko tutup, Admin masuk ke menu **⚙️ Admin Tools &rarr; Backup & Restore**.
2. Klik tombol **Unduh Cadangan Basis Data (.JSON)**.
3. Simpan file cadangan tersebut ke **Flashdisk USB Toko**.
4. **Cara Restore (Bila Komputer Rusak):**
   - Pasang aplikasi di komputer pengganti.
   - Buka menu *Admin Tools &rarr; Backup & Restore*.
   - Pilih berkas `.json` cadangan dari flashdisk.
   - Ketik `RESTORE_HEXTITANIUM` pada kolom konfirmasi.
   - Klik **Konfirmasi Pemulihan Data**. Seluruh data motor dan baut akan kembali seperti semula.

---

## 5. Panduan Menjalankan Sistem di Komputer Toko

Untuk menyalakan sistem di komputer toko setiap pagi:
1. Buka terminal atau jalankan script:
   ```bash
   ./scripts/start-local.sh
   ```
2. Atau jalankan perintah standar:
   ```bash
   npm run start:shop
   ```
3. Komputer toko akan menampilkan alamat IP lokal, contoh: `http://192.168.1.10:3000`.
4. Staf toko dapat membuka alamat tersebut dari Google Chrome / Safari di ponsel masing-masing yang terhubung ke Wi-Fi toko Hex Titanium.

---

## 6. Kriteria Keberhasilan & Evaluasi Program 1

Berdasarkan proposal rencana kerja dan berita acara serah terima:
1. **Kecepatan Layanan:** Waktu penyiapan baut berkurang minimal 50% (dari ±120 menit menjadi 5–10 menit).
2. **Kemandirian Karyawan:** Minimal 2 staf gerai dapat melayani dan menyiapkan baut secara mandiri tanpa harus menunggu pemilik toko.
3. **Kelengkapan Basis Data:** Memuat minimal 20 tipe sepeda motor terpopuler di Indonesia.
4. **Evaluasi Pengguna (SUS):** Evaluasi *System Usability Scale* dilakukan kepada staf dan pemilik toko dengan skor target &gt; 70 (Kategori Baik/Acceptable).

