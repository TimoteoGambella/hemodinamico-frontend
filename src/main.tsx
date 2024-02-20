import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes as Switch } from 'react-router-dom'
import MsgApiProvider from './contexts/MsgApiProvider'
import NotFound from './components/NotFound'
import Login from './components/Login'
import App from './components/App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MsgApiProvider>
      <BrowserRouter>
        <Switch>
          <Route path="/*" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/404" element={<NotFound />} />
        </Switch>
      </BrowserRouter>
    </MsgApiProvider>
  </React.StrictMode>
)
