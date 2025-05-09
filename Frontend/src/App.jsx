import React, { useEffect } from 'react'
import axios from 'axios'
import Register from './Component/Register'
import LoginForm from './Component/Login'
import { Outlet } from 'react-router-dom'
import Navbar from './Component/Navbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {

  return (
    <div>
     <ToastContainer/>
      <Navbar/>
      <Outlet/>
    </div>
  )
}

export default App
