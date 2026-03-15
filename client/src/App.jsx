import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home.jsx'
import Dashboard from './pages/dashboard.jsx'
import Login from './pages/login.jsx'
import Layout from './pages/layout.jsx'
import Resumebuilder from './pages/resumebuilder.jsx'
import Preview from './pages/preview.jsx'
import NotFound from './pages/notfound.jsx'

const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<Home />}/>
      
        <Route path='/app' element={<Layout />}> 
          <Route index element={<Dashboard />}/>
          <Route path='builder/:resumeId' element={<Resumebuilder />}/>
        </Route>
      
      <Route path='/Login' element={<Login />}/>
      <Route path='/preview/:resumeId' element={<Preview />}/>
      <Route path='/public/preview/:resumeId' element={<Preview />}/>
      <Route path='/not-found' element={<NotFound />}/>
      <Route path='*' element={<NotFound />}/>
    </Routes>
    </>
  )
}

export default App
