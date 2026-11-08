import { ref } from 'vue';

const backendPort = ref(
  import.meta.env.VITE_BACKEND_PORT ||
  (typeof window !== 'undefined' && window.location.port ? window.location.port : '3000')
);
const isBackendOnline = ref(true);
let hasInitialized = false;

export function useSystemInfo() {
  async function checkBackend() {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        if (data && data.port) {
          backendPort.value = String(data.port);
        }
        isBackendOnline.value = true;
      } else {
        isBackendOnline.value = false;
      }
    } catch {
      isBackendOnline.value = false;
    }
  }

  if (!hasInitialized && typeof window !== 'undefined') {
    hasInitialized = true;
    checkBackend();
  }

  return {
    backendPort,
    isBackendOnline,
    checkBackend,
  };
}
