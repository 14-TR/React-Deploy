import React from 'react';
import { createRoot } from 'react-dom/client';  
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create the root of the application
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Measure performance if needed
reportWebVitals();
