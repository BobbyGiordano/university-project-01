#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

echo "=========================================================="
echo "🔧 Memulai Sistem Spesifikasi Baut Hex Titanium (Lokal)"
echo "=========================================================="

# 1. Pastikan Docker PostgreSQL Aktif
echo "🐘 Memeriksa basis data PostgreSQL..."
docker compose up -d

# 2. Periksa apakah frontend telah dibangun
if [ ! -d "client/dist" ]; then
  echo "📦 Membangun antarmuka frontend (Vue 3 + Vite)..."
  cd client && npm run build && cd ..
fi

# 3. Jalankan backend server lokal
echo "🚀 Menjalankan server aplikasi..."
cd server
npm start

