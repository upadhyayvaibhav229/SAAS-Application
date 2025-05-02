import React from 'react'

const Home = () => {
    return (
        <div className='text-white h-screen  w-full flex flex-col items-center justify-center gap-2'>

            <h1 className='text-xl md:text-2xl text-blue-900 font-bold '>Get Started</h1>
            <p className='md:text-5xl text-3xl p-2 text-center'>Boost your productivity. <br /> Start using our app today.

            </p>
            <p className='md:text-xl text-xs text-center text-gray-300'>Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id <br /> veniam aliqua proident excepteur commodo do ea.

            </p>
            <button type="button" className='  text-xl py-2 px-3 rounded cursor-pointer bg-blue-700 hover:bg-blue-800'>Get Started</button>
        </div>
    )
}

export default Home
