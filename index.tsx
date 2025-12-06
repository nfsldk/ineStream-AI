import React from 'react';
import ReactDOM from 'react-dom/client';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Ensure App is available globally
const App = (window as any).App;

if (!App) {
  console.error("App component not found on window object. Ensure App.tsx is loaded correctly.");
  rootElement.innerHTML = '<div style="color:white; text-align:center; padding:20px;">Error loading application. Please refresh.</div>';
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}