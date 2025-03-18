import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/assets/styles/reset.less'
import App from './App'
import { initStore } from '@/store'


initStore().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
