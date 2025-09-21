import React, { useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Component/Sidebar';
import Header from './Component/Header';
import { AppContext } from './Context/AppContext';

const App = () => {
  const { isAuthReady } = useContext(AppContext);

if (!isAuthReady) {     
  return <div className="flex items-center justify-center h-screen">Loading...</div>;
}

  const location = useLocation();
  const isAuthPage = location.pathname === "/login"; 

  return (
    <div className="flex h-screen">
      {!isAuthPage && <Sidebar />}
      <div className="flex-1 flex flex-col">
        {!isAuthPage && <Header />}
        <ToastContainer />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};


export default App;
