import { useEffect, useState } from 'react';
// Disabled install instructions component (file is stubbed out)
const InstallInstructions = () => null;

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

    // Disable SW registration in development to avoid intercept issues
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
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
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent);
    const isEdge = /Edge/.test(navigator.userAgent);

    if (window.deferredPrompt) {
      // For Chrome/Edge on Android or Desktop
      window.deferredPrompt.prompt();
      window.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        window.deferredPrompt = null;
        setShowInstallButton(false);
      });
    } else if (isIOS) {
      // For iOS devices
      alert('To install on iOS:\n1. Tap the Share button (square with arrow)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to install');
    } else if (isAndroid && !isChrome) {
      // For Android devices not using Chrome
      alert('To install on Android:\n1. Open this site in Chrome\n2. Tap Menu (⋮)\n3. Tap "Install App" or "Add to Home Screen"');
    } else if (isChrome || isEdge) {
      // For Chrome/Edge on desktop without install prompt
      alert('To install on Desktop:\n1. Look for the install icon (⊕) in the address bar\n2. Click it to install\n3. If not visible, click Menu > Install ClassCue');
    } else {
      // Fallback for other browsers
      alert('For the best installation experience, please open ClassCue in Chrome, Edge, or Safari.');
    }
  };

  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Installation guide and download buttons - positioned for mobile */}
      {/* {!isInstalled && (
        <div className="fixed top-4 right-4 flex gap-2 z-40">
          <button
            onClick={() => setShowInstallInstructions(true)}
            className="bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm sm:px-4 sm:text-base"
            title="View detailed installation instructions"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">Install Guide</span>
            <span className="sm:hidden">Guide</span>
          </button>
          <button
            onClick={handleInstallClick}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm sm:px-4 sm:text-base"
            title="Install ClassCue on your device"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Install App</span>
            <span className="sm:hidden">Install</span>
          </button>
        </div>
      )}

      {showInstallInstructions && (
        <InstallInstructions onClose={() => setShowInstallInstructions(false)} />
      )} */}
    </>
  );
};

export default PWARegistration;
