import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../components/NavBar.jsx';
import { useSelector } from 'react-redux';

const Layout = () => {
  const { user, loading } = useSelector(state => state.auth)
  const hasToken = !!localStorage.getItem('token')
  const isAuthenticated = !!user || hasToken

  if(loading && !hasToken) {
    return null;
  }

  return (
    <div>
      {
        isAuthenticated ? (
        <div className='min-h-screen bg-gray-50'>
        <Navbar />
        <Outlet />
        </div>
        )
        : <Navigate to='/login' />
      }
    </div>
  )
}

export default Layout
