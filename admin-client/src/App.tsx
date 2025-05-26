import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import PrivateRoute from './components/PrivateRoute.tsx'
import Dashboard from './pages/Dashboard.tsx'
import EditPage from './pages/EditPage.tsx'
import Navbar from './components/Navbar.tsx'
import LoginPage from './pages/LoginPage.tsx'

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/admin/:activeCategory?" element={<Dashboard />} />
          <Route path="/admin/:operationType/:contentType/:contentId?" element={<EditPage />} />
        </Route>
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
