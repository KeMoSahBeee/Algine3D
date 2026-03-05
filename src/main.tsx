import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Apply dark class by default to match useMatrixStore initial state
document.documentElement.classList.add('dark');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
