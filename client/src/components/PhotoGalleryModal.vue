<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    @click.self="close"
  >
    <div
      class="bg-white dark:bg-[#121215] rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all"
    >
      <!-- Modal Header -->
      <div class="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div class="min-w-0 pr-3">
          <div class="flex items-center space-x-2 mb-0.5">
            <span class="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
            <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              {{ categoryTitle || 'Galeri Foto' }}
            </span>
            <span v-if="images && images.length" class="text-[10px] font-mono text-zinc-500">
              ({{ activeIndex + 1 }} / {{ images.length }})
            </span>
          </div>
          <h2 class="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
            {{ itemTitle }}
          </h2>
          <p v-if="itemSubtitle" class="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            {{ itemSubtitle }}
          </p>
        </div>

        <button
          @click="close"
          type="button"
          class="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer shrink-0"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        <!-- Main Image Viewer -->
        <div v-if="images && images.length > 0" class="space-y-3">
          <div class="relative bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center min-h-[220px] max-h-[380px]">
            <img
              :src="currentImage?.url"
              :alt="currentImage?.caption || itemTitle"
              class="w-full h-full max-h-[380px] object-contain select-none"
            />

            <!-- Primary Badge -->
            <div
              v-if="currentImage?.isPrimary"
              class="absolute top-3 left-3 bg-zinc-900/90 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded-md backdrop-blur-sm"
            >
              Foto Utama
            </div>

            <!-- Navigation Arrows (when multiple images) -->
            <div v-if="images.length > 1" class="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
              <button
                @click="prevImage"
                type="button"
                class="pointer-events-auto p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-700/60 shadow-lg backdrop-blur-sm transition-all cursor-pointer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button
                @click="nextImage"
                type="button"
                class="pointer-events-auto p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-700/60 shadow-lg backdrop-blur-sm transition-all cursor-pointer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Current Image Info & Actions -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-zinc-50 dark:bg-[#18181c] p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
            <div>
              <p class="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                {{ currentImage?.caption || 'Tanpa keterangan' }}
              </p>
              <p class="text-[10px] font-mono text-zinc-400 mt-0.5">
                {{ currentImage?.url }}
              </p>
            </div>

            <div v-if="canManage" class="flex items-center space-x-2 shrink-0">
              <button
                v-if="!currentImage?.isPrimary"
                @click="setPrimaryImage(currentImage.id)"
                :disabled="isProcessing"
                type="button"
                class="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                Jadikan Utama
              </button>
              <button
                @click="deleteImage(currentImage.id)"
                :disabled="isProcessing"
                type="button"
                class="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer disabled:opacity-50"
              >
                Hapus
              </button>
            </div>
          </div>

          <!-- Thumbnails Strip -->
          <div v-if="images.length > 1" class="flex items-center space-x-2 overflow-x-auto pb-1 pt-1">
            <button
              v-for="(img, idx) in images"
              :key="img.id"
              @click="activeIndex = idx"
              type="button"
              class="relative w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer bg-zinc-900"
              :class="[
                activeIndex === idx
                  ? 'border-zinc-900 dark:border-zinc-100 ring-2 ring-zinc-500/30'
                  : 'border-zinc-200 dark:border-zinc-800 opacity-60 hover:opacity-100'
              ]"
            >
              <img :src="img.url" class="w-full h-full object-cover" />
              <div v-if="img.isPrimary" class="absolute bottom-0 inset-x-0 bg-emerald-500 h-1"></div>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="p-8 text-center bg-zinc-50 dark:bg-[#18181c] rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800"
        >
          <svg class="w-10 h-10 mx-auto text-zinc-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p class="text-xs font-medium text-zinc-700 dark:text-zinc-300">Belum ada foto yang diunggah</p>
          <p class="text-[11px] text-zinc-400 mt-0.5">Unggah foto spesifikasi baut atau tipe motor di bawah ini</p>
        </div>

        <!-- Admin Photo Upload Form -->
        <div v-if="canManage" class="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              Unggah Foto Baru (Bisa Banyak)
            </span>
            <div class="inline-flex p-0.5 bg-zinc-100 dark:bg-[#18181c] rounded-lg border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono">
              <button
                @click="uploadMode = 'file'"
                type="button"
                class="px-2 py-0.5 rounded transition-all cursor-pointer"
                :class="[uploadMode === 'file' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold' : 'text-zinc-400']"
              >
                File Gambar
              </button>
              <button
                @click="uploadMode = 'url'"
                type="button"
                class="px-2 py-0.5 rounded transition-all cursor-pointer"
                :class="[uploadMode === 'url' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold' : 'text-zinc-400']"
              >
                Input URL
              </button>
            </div>
          </div>

          <!-- Mode 1: File Upload (Multi-file support) -->
          <div v-if="uploadMode === 'file'" class="space-y-3">
            <label
              class="flex flex-col items-center justify-center p-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-xl cursor-pointer bg-zinc-50/50 dark:bg-[#18181c]/50 transition-all"
            >
              <svg class="w-7 h-7 text-zinc-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <span class="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {{ selectedFiles.length ? `${selectedFiles.length} file dipilih` : 'Klik untuk memilih satu atau beberapa foto' }}
              </span>
              <span class="text-[10px] text-zinc-400 mt-0.5">
                Mendukung PNG, JPEG, WebP, GIF (Maks 8MB per file)
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                @change="onFileChange"
                class="hidden"
              />
            </label>

            <!-- File list pills -->
            <div v-if="selectedFiles.length > 0" class="flex flex-wrap gap-1.5">
              <span
                v-for="(f, i) in selectedFiles"
                :key="i"
                class="inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
              >
                {{ f.name }} ({{ Math.round(f.size / 1024) }} KB)
              </span>
            </div>
          </div>

          <!-- Mode 2: Direct URL -->
          <div v-else class="space-y-2">
            <input
              v-model="inputUrl"
              type="text"
              placeholder="Contoh: /uploads/bolts/... atau https://..."
              class="w-full px-3 py-2 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <!-- Caption Input -->
          <div class="flex flex-col sm:flex-row gap-2">
            <input
              v-model="inputCaption"
              type="text"
              placeholder="Keterangan foto (opsional, contoh: Blue Ice Glossy / Tampak Sisi Kiri)..."
              class="flex-1 px-3 py-2 bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
            />
            <button
              @click="submitUpload"
              :disabled="isProcessing || (uploadMode === 'file' ? selectedFiles.length === 0 : !inputUrl.trim())"
              type="button"
              class="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-40 shrink-0"
            >
              <span v-if="isProcessing">Mengunggah...</span>
              <span v-else>Unggah Foto</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  categoryTitle: { type: String, default: '' },
  itemTitle: { type: String, default: '' },
  itemSubtitle: { type: String, default: '' },
  images: { type: Array, default: () => [] },
  canManage: { type: Boolean, default: false },
  uploadEndpoint: { type: String, required: true },
  deleteEndpointBase: { type: String, required: true },
  primaryEndpointBase: { type: String, required: true },
  authHeaders: { type: Function, required: true },
});

const emit = defineEmits(['close', 'updated']);

const activeIndex = ref(0);
const uploadMode = ref('file');
const selectedFiles = ref([]);
const inputUrl = ref('');
const inputCaption = ref('');
const isProcessing = ref(false);

const currentImage = computed(() => {
  if (!props.images || props.images.length === 0) return null;
  return props.images[activeIndex.value] || props.images[0];
});

watch(() => props.images, (newImgs) => {
  if (activeIndex.value >= (newImgs?.length || 0)) {
    activeIndex.value = 0;
  }
}, { immediate: true });

const close = () => {
  selectedFiles.value = [];
  inputUrl.value = '';
  inputCaption.value = '';
  emit('close');
};

const nextImage = () => {
  if (props.images && props.images.length > 0) {
    activeIndex.value = (activeIndex.value + 1) % props.images.length;
  }
};

const prevImage = () => {
  if (props.images && props.images.length > 0) {
    activeIndex.value = (activeIndex.value - 1 + props.images.length) % props.images.length;
  }
};

const onFileChange = (e) => {
  selectedFiles.value = Array.from(e.target.files || []);
};

const submitUpload = async () => {
  if (isProcessing.value) return;
  isProcessing.value = true;
  try {
    let res;
    if (uploadMode.value === 'file') {
      const formData = new FormData();
      for (const file of selectedFiles.value) {
        formData.append('images', file);
      }
      if (inputCaption.value.trim()) {
        formData.append('caption', inputCaption.value.trim());
      }

      res = await fetch(props.uploadEndpoint, {
        method: 'POST',
        headers: {
          Authorization: props.authHeaders().Authorization,
        },
        body: formData,
      });
    } else {
      res = await fetch(props.uploadEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...props.authHeaders(),
        },
        body: JSON.stringify({
          url: inputUrl.value.trim(),
          caption: inputCaption.value.trim() || null,
        }),
      });
    }

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Gagal mengunggah foto.');
      return;
    }

    const updatedImages = await res.json();
    selectedFiles.value = [];
    inputUrl.value = '';
    inputCaption.value = '';
    emit('updated', updatedImages);
  } catch (err) {
    console.error('Upload error:', err);
    alert('Terjadi kesalahan saat mengunggah foto.');
  } finally {
    isProcessing.value = false;
  }
};

const setPrimaryImage = async (imageId) => {
  if (isProcessing.value) return;
  isProcessing.value = true;
  try {
    const res = await fetch(`${props.primaryEndpointBase}/${imageId}/primary`, {
      method: 'PATCH',
      headers: props.authHeaders(),
    });
    if (res.ok) {
      const updated = await res.json();
      emit('updated', updated);
    } else {
      const data = await res.json();
      alert(data.error || 'Gagal mengatur foto utama.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    isProcessing.value = false;
  }
};

const deleteImage = async (imageId) => {
  if (!confirm('Hapus foto ini secara permanen?')) return;
  if (isProcessing.value) return;
  isProcessing.value = true;
  try {
    const res = await fetch(`${props.deleteEndpointBase}/${imageId}`, {
      method: 'DELETE',
      headers: props.authHeaders(),
    });
    if (res.ok) {
      const updated = await res.json();
      if (activeIndex.value >= updated.length) {
        activeIndex.value = Math.max(0, updated.length - 1);
      }
      emit('updated', updated);
    } else {
      const data = await res.json();
      alert(data.error || 'Gagal menghapus foto.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    isProcessing.value = false;
  }
};
</script>

