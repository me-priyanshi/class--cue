import { useEffect, useState } from 'react';
import InstallInstructions from './InstallInstructions.jsx';

const PWARegistration = () => {
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Handle PWA install prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWA install prompt triggered');
      e.preventDefault();
      deferredPrompt = e;
      window.deferredPrompt = deferredPrompt;
      setShowInstallButton(true);
    });

    // Handle successful installation
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setShowInstallButton(false);
    });

    // Check if install prompt is available after a delay
    setTimeout(() => {
      if (!isInstalled && !showInstallButton) {
        // Show manual install instructions if no automatic prompt
        setShowInstallInstructions(true);
      }
    }, 3000);

  }, [isInstalled, showInstallButton]);

  const handleInstallClick = () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      window.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
          // Show manual instructions if user dismisses
          setShowInstallInstructions(true);
        }
        window.deferredPrompt = null;
        setShowInstallButton(false);
      });
    } else {
      // Show manual instructions if no prompt available
      setShowInstallInstructions(true);
    }
  };

  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Installation guide button - positioned for mobile */}
      {!isInstalled && (
        <button
          onClick={() => setShowInstallInstructions(true)}
          className="fixed top-4 left-4 bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-green-700 transition-colors z-40 flex items-center space-x-2 text-sm sm:top-20 sm:right-4 sm:left-auto sm:px-4 sm:text-base"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="hidden sm:inline">Install Guide</span>
          <span className="sm:hidden">Guide</span>
        </button>
      )}

      {showInstallInstructions && (
        <InstallInstructions onClose={() => setShowInstallInstructions(false)} />
      )}
    </>
  );
};

export default PWARegistration;
