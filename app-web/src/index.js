import React from 'react';
import ReactDOM from 'react-dom/client';
import './modules/index.css';
import App from './App.js';
import reportWebVitals from './modules/reportWebVitals.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <App />
  </React.StrictMode>
);

reportWebVitals();
