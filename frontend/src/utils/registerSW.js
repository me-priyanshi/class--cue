// Service worker registration
if ('serviceWorker' in navigator) {
  const swUrl = import.meta.env.MODE === 'production' 
    ? '/classCue/sw.js'
    : '/sw.js';
    
  window.addEventListener('load', function() {
    navigator.serviceWorker
      .register(swUrl)
      .then(function(registration) {
        console.log('ServiceWorker registration successful');
      })
      .catch(function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}