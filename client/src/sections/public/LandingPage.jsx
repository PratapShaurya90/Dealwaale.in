import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  const images = [
    "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=2089",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=2070",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015"
  ]

  return (
    <div className='w-full min-h-[85vh] flex flex-wrap primaryColor relative overflow-hidden'>
      {/* Left Section: Text Content */}
      <div className='w-full md:w-[45%] flex flex-col justify-center px-8 md:px-20 py-16 z-20'>
        <div className="space-y-6">


          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-white m-0">
            Tired of <br />
            <span className="gradient-green italic pr-4">selling online?</span>
          </h1>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-neutral-300 leading-tight">
            Or struggling to find <br />
            <span className="gradient-text pr-4">the right customers?</span>
          </h2>

          <p className="text-neutral-400 text-lg md:text-xl leading-relaxed max-w-xl font-light">
            Connect with India’s largest community of buyers and sellers.
            Buy and sell your products directly — <span className="text-white font-normal">no middlemen, no interference.</span>
          </p>

          <div className='flex flex-col sm:flex-row flex-wrap gap-4 md:gap-5 pt-8'>
            <Link
              to="/signup"
              className='group relative inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-green-500 text-black font-bold rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-green-500/20'
            >
              <span className="relative z-10">Explore Marketplace</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>

            <Link
              to="/login"
              className='inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 border border-neutral-700 text-white font-semibold rounded-xl hover:bg-neutral-800/50 hover:border-neutral-500 transition-all active:scale-95'
            >
              Log In
            </Link>
          </div>
        </div>
      </div>

      {/* Right Section: Continuous Marquee Carousel matching left height */}
      <div className='w-full md:w-[55%] flex items-center relative overflow-hidden h-[400px] md:h-auto'>
        <div className="flex moving items-center py-10">
          {[...images, ...images, ...images].map((img, index) => (
            <div
              key={index}
              className="w-64 h-56 sm:w-80 sm:h-72 md:w-144 md:h-120 flex-shrink-0 mx-4 md:mx-6 rounded-2xl md:rounded-[3rem] overflow-hidden border-4 md:border-8 border-orange-100 outline-6 md:outline-10 outline-orange-200 shadow-2xl relative group"
            >
              <img
                src={img}
                alt={`Marketplace ${index}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Deep Cinematic Edge Blurs */}
        <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-primaryColor via-primaryColor/40 to-transparent pointer-events-none z-10"></div>
        <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-primaryColor via-primaryColor/40 to-transparent pointer-events-none z-10"></div>
      </div>
    </div>
  )
}

export default LandingPage