import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home.jsx'
import Dashboard from './pages/dashboard.jsx'
import Login from './pages/login.jsx'
import Layout from './pages/layout.jsx'
import Resumebuilder from './pages/resumebuilder.jsx'
import Preview from './pages/preview.jsx'

const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<Home />}/>
      
        <Route path='App' element={<Layout />}> 
          <Route index element={<Dashboard />}/>
          <Route path='builder/:resumeId' element={<Resumebuilder />}/>
        </Route>
      
      <Route path='/Login' element={<Login />}/>
      <Route path='/Preview/:resumeId' element={<Preview />}/>
    </Routes>
    </>
  )
}

export default App
