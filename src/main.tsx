import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes as Switch } from 'react-router-dom'
import { LaboratoryDataProvider } from './contexts/LaboratoryDataProvider'
import { StretcherDataProvider } from './contexts/StretcherDataProvider'
import { PatientDataProvider } from './contexts/PatientDataProvider'
import { LoginStatusProvider } from './contexts/LoginStatusProvider'
import { UserDataProvider } from './contexts/UserDataProvider'
import MsgApiProvider from './contexts/MsgApiProvider'
import NotFound from './components/NotFound'
import Login from './components/Login'
import App from './components/App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MsgApiProvider>
      <BrowserRouter>
        <LoginStatusProvider>
          <StretcherDataProvider>
            <LaboratoryDataProvider>
              <PatientDataProvider>
                <UserDataProvider>
                  <Switch>
                    <Route path="/*" element={<App />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/404" element={<NotFound />} />
                  </Switch>
                </UserDataProvider>
              </PatientDataProvider>
            </LaboratoryDataProvider>
          </StretcherDataProvider>
        </LoginStatusProvider>
      </BrowserRouter>
    </MsgApiProvider>
  </React.StrictMode>
)
