import React, { useContext, useEffect } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../Context/AppContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { userData, getUserData, isLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && !userData) {
      getUserData();
    }
  }, [isLoggedIn, userData, getUserData]);

  return (
    <div className='text-white min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-black px-4 py-10'>
      {/* Logo / Header Image */}
      <img src={assets.header_img} alt="logo" className='h-32 w-32 md:h-40 md:w-40 mb-4' />

      {/* Welcome Message */}
      <h1 className='text-xl md:text-3xl text-yellow-400 font-bold mb-2'>
        Hey {userData ? userData.firstName : 'Developer 👏'}!
      </h1>

      {/* Tagline */}
      <p className='md:text-5xl text-3xl font-semibold text-center mb-4'>
        Write, Read & Shop – All in One Place 🚀
      </p>

      {/* Sub-description */}
      <p className='md:text-lg text-sm text-center text-gray-300 max-w-xl mb-8'>
        Dive into engaging blogs written by people like you and shop top-rated products – all from one unified platform.
      </p>

      {/* Call to Action Buttons */}
      <div className='flex flex-col md:flex-row gap-4'>
        <button
          onClick={() => navigate('/blogs')}
          className='bg-yellow-500 hover:bg-yellow-600 text-black text-lg px-6 py-3 rounded-lg shadow-md'
        >
          Explore Blogs
        </button>

        <button
          onClick={() => navigate('/products')}
          className='bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-lg shadow-md'
        >
          Start Shopping
        </button>
      </div>
    </div>
  );
};

export default Home;
