// import React, { useState, useEffect } from 'react';

// const InstallInstructions = ({ onClose }) => {
//   const [isIOS, setIsIOS] = useState(false);
//   const [isAndroid, setIsAndroid] = useState(false);
//   const [isChrome, setIsChrome] = useState(false);
//   const [isSafari, setIsSafari] = useState(false);
//   const [isEdge, setIsEdge] = useState(false);
//   const [isFirefox, setIsFirefox] = useState(false);

//   useEffect(() => {
//     const userAgent = navigator.userAgent.toLowerCase();
//     const platform = navigator.platform.toLowerCase();
    
//     setIsIOS(/iphone|ipad|ipod/.test(userAgent) || (platform === 'macintel' && navigator.maxTouchPoints > 1));
//     setIsAndroid(/android/.test(userAgent));
//     setIsChrome(/chrome/.test(userAgent) && !/edge/.test(userAgent));
//     setIsSafari(/safari/.test(userAgent) && !/chrome/.test(userAgent));
//     setIsEdge(/edge/.test(userAgent));
//     setIsFirefox(/firefox/.test(userAgent));
//   }, []);

//   const getInstallInstructions = () => {
//     // Check if it's a mobile device first
//     const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
//     if (isIOS) {
//       return {
//         title: "📱 Install ClassCue on iPhone/iPad",
//         steps: [
//           {
//             icon: "🌐",
//             text: "Make sure you're using Safari browser"
//           },
//           {
//             icon: "📤",
//             text: "Tap the Share button (square with arrow up) at the bottom"
//           },
//           {
//             icon: "📋",
//             text: "Scroll down and tap 'Add to Home Screen'"
//           },
//           {
//             icon: "✏️",
//             text: "Edit the name if desired and tap 'Add'"
//           },
//           {
//             icon: "🏠",
//             text: "Find the ClassCue app icon on your home screen"
//           },
//           {
//             icon: "🔔",
//             text: "Enable notifications when prompted for attendance reminders"
//           }
//         ]
//       };
//     } else if (isAndroid) {
//       return {
//         title: "📱 Install ClassCue on Android Phone",
//         steps: [
//           {
//             icon: "🌐",
//             text: "Open the Google Chrome browser"
//           },
//           {
//             icon: "🔍",
//             text: "Navigate to the ClassCue website"
//           },
//           {
//             icon: "⋮",
//             text: "Tap the menu icon (three vertical dots) in the top right corner"
//           },
//           {
//             icon: "📋",
//             text: "Look for and tap 'Add to home screen' or 'Install' in the menu"
//           },
//           {
//             icon: "✅",
//             text: "Tap the 'Add' button in the pop-up to confirm"
//           },
//           {
//             icon: "🏠",
//             text: "The PWA will now be added to your home screen as an app icon"
//           }
//         ]
//       };
//     } else if (isMobile) {
//       return {
//         title: "📱 Install ClassCue on Mobile",
//         steps: [
//           {
//             icon: "🌐",
//             text: "Open the Google Chrome browser"
//           },
//           {
//             icon: "🔍",
//             text: "Navigate to the ClassCue website"
//           },
//           {
//             icon: "⋮",
//             text: "Tap the menu icon (three vertical dots) in the top right corner"
//           },
//           {
//             icon: "📋",
//             text: "Look for and tap 'Add to home screen' or 'Install' in the menu"
//           },
//           {
//             icon: "✅",
//             text: "Tap the 'Add' button in the pop-up to confirm"
//           },
//           {
//             icon: "🏠",
//             text: "The PWA will now be added to your home screen as an app icon"
//           }
//         ]
//       };
//     } else if (isChrome) {
//       return {
//         title: "💻 Install ClassCue on Desktop Chrome",
//         steps: [
//           {
//             icon: "🔧",
//             text: "Look for the install icon in the address bar"
//           },
//           {
//             icon: "➕",
//             text: "Click the install icon or go to Menu > Install ClassCue"
//           },
//           {
//             icon: "✅",
//             text: "Click 'Install' in the popup dialog"
//           },
//           {
//             icon: "🖥️",
//             text: "The app will appear in your applications"
//           }
//         ]
//       };
//     } else if (isEdge) {
//       return {
//         title: "💻 Install ClassCue on Microsoft Edge",
//         steps: [
//           {
//             icon: "🔧",
//             text: "Look for the install icon in the address bar"
//           },
//           {
//             icon: "➕",
//             text: "Click the install icon or go to Menu > Apps > Install this site as an app"
//           },
//           {
//             icon: "✅",
//             text: "Click 'Install' in the popup dialog"
//           },
//           {
//             icon: "🖥️",
//             text: "The app will appear in your applications"
//           }
//         ]
//       };
//     } else {
//       return {
//         title: "📱 Install ClassCue on Your Device",
//         steps: [
//           {
//             icon: "🌐",
//             text: "Open the Google Chrome browser"
//           },
//           {
//             icon: "🔍",
//             text: "Navigate to the ClassCue website"
//           },
//           {
//             icon: "⋮",
//             text: "Tap the menu icon (three vertical dots) in the top right corner"
//           },
//           {
//             icon: "📋",
//             text: "Look for and tap 'Add to home screen' or 'Install' in the menu"
//           },
//           {
//             icon: "✅",
//             text: "Tap the 'Add' button in the pop-up to confirm"
//           },
//           {
//             icon: "🏠",
//             text: "The PWA will now be added to your home screen as an app icon"
//           }
//         ]
//       };
//     }
//   };

//   const instructions = getInstallInstructions();

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold text-gray-900">{instructions.title}</h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 text-2xl"
//             >
//               ×
//             </button>
//           </div>
          
//           <div className="space-y-4">
//             {instructions.steps.map((step, index) => (
//               <div key={index} className="flex items-start space-x-3">
//                 <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-lg">
//                   {step.icon}
//                 </div>
//                 <p className="text-gray-700 text-sm leading-relaxed">{step.text}</p>
//               </div>
//             ))}
//           </div>

//           <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//             <h3 className="font-semibold text-blue-900 mb-2">📱 Mobile Pro Tips:</h3>
//             <ul className="text-sm text-blue-800 space-y-1">
//               <li>• 📱 Works like a native app on your phone</li>
//               <li>• 🔔 Enable notifications for attendance reminders</li>
//               <li>• 📶 Works offline - no internet needed after install</li>
//               <li>• ⚡ Faster than opening in browser every time</li>
//               <li>• 🗑️ Uninstall anytime from your phone settings</li>
//               <li>• 📲 Add to home screen for quick access</li>
//             </ul>
//           </div>

//           <div className="mt-4 flex space-x-3">
//             <button
//               onClick={onClose}
//               className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
//             >
//               Got it!
//             </button>
//             {/* <button
//               onClick={() => {
//                 // Try to trigger install prompt if available
//                 if (window.deferredPrompt) {
//                   window.deferredPrompt.prompt();
//                 }
//                 onClose();
//               }}
//               className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               📱 Install on Phone
//             </button> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InstallInstructions;
