import React from 'react'
import { assets } from '../assets/assets'

const Home = () => {
    return (
        <div className='text-white h-screen  w-full flex flex-col items-center justify-center gap-2 bg-slate-900'>

            <img src={assets.header_img} alt="logo" className='h-40 w-40 mb-1' />

            <h1 className='text-xl md:text-2xl text-yellow-400 font-bold '>Hey Developer!👏</h1>
            <p className='md:text-5xl text-3xl p-2 text-center'>Boost your productivity. <br /> Start using our app today.

            </p>
            <p className='md:text-xl text-xs text-center text-gray-300'>Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id <br /> veniam aliqua proident excepteur commodo do ea.

            </p>
            <button type="button" className='  text-xl py-2 px-3 rounded cursor-pointer bg-blue-700 hover:bg-blue-800'>Get Started</button>
        </div>
    )
}

export default Home
