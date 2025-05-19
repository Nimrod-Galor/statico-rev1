import './App.css'


import { Route, Routes } from 'react-router-dom'

import Dashboard from './pages/Dashboard.tsx'





function App() {

  return (
    <div>


      <Routes>
        <Route path="/admin/:activeCategory?" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App
