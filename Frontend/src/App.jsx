import React, { useEffect } from 'react'
import axios from 'axios'
import Register from './Component/Register'
import LoginForm from './Component/Login'
import { Outlet } from 'react-router-dom'
import Navbar from './Component/Navbar'

const App = () => {
  const URL = 'http://localhost:5000/api/test'
  const [message, setMessage] = React.useState('')
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await axios.get(URL)
        setMessage(response.data.message)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])
  return (
    <div>
      {/* <h1>{message}...</h1>
      <h1 className="text-center text-red-500">TESTING</h1> */}
      <Navbar/>
      <Outlet/>
    </div>
  )
}

export default App
