import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import AuthProvider from './context/AuthProvider.tsx'
import App from './App.tsx'


const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>  
      <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
