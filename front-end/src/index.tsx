import React from 'react';
import ReactDOM from 'react-dom/client'; // Using the modern `createRoot` API
import App from './App'; // Import the main App component

// Find the HTML element with id "root"
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Render <App /> inside the <React.StrictMode> wrapper
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
