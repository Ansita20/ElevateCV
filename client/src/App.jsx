import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home.jsx'
import Dashboard from './pages/dashboard.jsx'
import Login from './pages/login.jsx'
import Layout from './pages/layout.jsx'
import Resumebuilder from './pages/resumebuilder.jsx'
import Preview from './pages/preview.jsx'
import NotFound from './pages/notfound.jsx'
import { useDispatch } from 'react-redux'
import { login, setLoading } from './app/features/authSlice'
import api from './configs/api'
import {Toaster} from 'react-hot-toast'

const App = () => {

  const dispatch = useDispatch();

  const getUserData = async () => {
    const token = localStorage.getItem('token');
    try {
      if(token){
        const { data } = await api.get('/api/users/data', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if(data.user){
          dispatch(login({token, user: data.user}))
        }
      }
    }catch(error) {
      console.log(error.message);
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    getUserData();
  }, [])

  return (
    <>
    <Toaster />
    <Routes>
      <Route path='/' element={<Home />}/>
      
        <Route path='/app' element={<Layout />}> 
          <Route index element={<Dashboard />}/>
          <Route path='builder/:resumeId' element={<Resumebuilder />}/>
        </Route>
      
      <Route path='/login' element={<Login />}/>
      <Route path='/preview/:resumeId' element={<Preview />}/>
      <Route path='/public/preview/:resumeId' element={<Preview />}/>
      <Route path='/not-found' element={<NotFound />}/>
      <Route path='*' element={<NotFound />}/>
    </Routes>
    </>
  )
}

export default App
