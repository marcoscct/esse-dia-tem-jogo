// Service Worker minimal para permitir a instalação do PWA sem problemas de cache com dados dinâmicos do calendário.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Apenas passa a requisição adiante, garantindo que o app funcione sempre com dados novos.
  // Pode ser expandido futuramente para cache offline de assets estáticos.
});
