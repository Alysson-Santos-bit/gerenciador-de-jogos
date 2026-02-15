// sw.js - Service Worker Mínimo para PWA
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Instalado com sucesso');
});

self.addEventListener('fetch', (e) => {
  // Apenas responde o básico para o navegador não reclamar
  e.respondWith(fetch(e.request));
});