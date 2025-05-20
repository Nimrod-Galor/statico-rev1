import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Dashboard from './pages/Dashboard.tsx'
import EditPage from './pages/EditPage.tsx'
import Navbar from './components/Navbar.tsx'

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/admin/:activeCategory?" element={<Dashboard />} />
        <Route path="/admin/:operation/:activeCategory/:id?" element={<EditPage />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
