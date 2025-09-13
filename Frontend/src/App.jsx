import React, { useEffect } from 'react'
import axios from 'axios'
import Register from './Component/Register'
import LoginForm from './Component/Login'
import { Outlet } from 'react-router-dom'
import Navbar from './Component/Navbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from './Component/Sidebar'

const App = () => {

  return (
    <div className="min-h-screen max-w-[1600px] mx-auto bg-gradient-to-br from-slate-900 to-black">
     <ToastContainer />
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8  text-base">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default App
