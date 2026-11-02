import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('hextitanium-token') || null);
  const user = ref(JSON.parse(localStorage.getItem('hextitanium-user') || 'null'));

  const isAuthenticated = computed(() => Boolean(token.value && user.value));
  const isAdmin = computed(() => user.value?.role === 'ADMIN');
  const isStaff = computed(() => user.value?.role === 'STAFF' || user.value?.role === 'ADMIN');

  async function login(username, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login gagal.');
    }

    token.value = data.token;
    user.value = data.user;
    localStorage.setItem('hextitanium-token', data.token);
    localStorage.setItem('hextitanium-user', JSON.stringify(data.user));

    return data.user;
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('hextitanium-token');
    localStorage.removeItem('hextitanium-user');
  }

  function authHeaders() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {};
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    isStaff,
    login,
    logout,
    authHeaders,
  };
});

