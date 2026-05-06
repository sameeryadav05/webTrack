import React from "react";
import Galaxy from "../components/Galaxy";


const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      
      {/* Galaxy Background */}
      <div className="absolute inset-0 z-0">
        <Galaxy
          mouseRepulsion
          mouseInteraction
          density={1}
          glowIntensity={0.4}
          saturation={0}
          hueShift={140}
          twinkleIntensity={0.4}
          rotationSpeed={0.05}
          repulsionStrength={2}
          autoCenterRepulsion={0}
          starSpeed={0.4}
          speed={1}
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-[1]" />

      {/* Purple Glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-violet-500/20 blur-[180px] rounded-full z-[2]" />

      {/* Main Content */}
      <div className="relative z-10">
        
        {/* Navbar */}
<nav className="max-w-7xl mx-auto px-6 pt-5">
  <div className="flex items-center justify-between border border-white/10 bg-white/5 backdrop-blur-xl rounded-xl px-5 py-3">
    
    {/* Logo */}
    <div className="flex items-center gap-3">
      
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center font-bold text-sm shadow-lg shadow-violet-500/20">
        W
      </div>

      <div>
        <h2 className="text-lg font-semibold leading-none">
          WebTrack
        </h2>

        <p className="text-[11px] text-gray-400 mt-1">
          Analytics Platform
        </p>
      </div>
    </div>

    {/* Navigation */}
    <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
      <a href="#" className="hover:text-white transition">
        Features
      </a>

      <a href="#" className="hover:text-white transition">
        Analytics
      </a>

      <a href="#" className="hover:text-white transition">
        Pricing
      </a>

      <a href="#" className="hover:text-white transition">
        Docs
      </a>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-3">
      
      <button className="bg-white text-black px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
        Login
      </button>

      {/* <button className="bg-white text-black px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
        Start Free
      </button> */}
    </div>
  </div>
</nav>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center px-6 pt-28">
          
          {/* Badge */}
            <div className="flex items-center gap-3 border border-white/10 bg-white/5 backdrop-blur-2xl rounded-full px-4 py-2 shadow-xl shadow-violet-500/5">
              
              {/* Pulse Dot */}
              <div className="relative flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-400"></div>

                <div className="absolute w-2.5 h-2.5 rounded-full bg-violet-400 animate-ping opacity-40"></div>
              </div>

              {/* Text */}
              <p className="text-sm text-gray-300 tracking-wide">
                Real-time analytics platform now live
              </p>

              {/* Small Arrow */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>

          {/* Heading */}
     
          <h1 className="text-5xl md:text-7xl font-bold max-w-5xl leading-tight mt-10">
            Understand Every Visitor
            <br />
            In Real-Time.
          </h1>


          {/* Description */}
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mt-8 leading-9">
            Monitor live visitors, page views, traffic sources, sessions,
            events, clicks, conversions and user behavior with one lightweight
            tracking script.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 mt-12">
            
            <button className="bg-white text-black px-9 py-4 rounded-2xl font-semibold hover:bg-gray-200 transition shadow-2xl">
              Start Tracking Free
            </button>

            <button className="border border-white/10 bg-white/5 backdrop-blur-xl px-9 py-4 rounded-2xl text-gray-300 hover:bg-white/10 hover:text-white transition">
              View Live Dashboard
            </button>
          </div>

          {/* Small Stats */}
          <div className="flex flex-wrap items-center justify-center gap-10 mt-16 text-gray-400 text-sm">
            
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span>Live Visitor Tracking</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-violet-400"></div>
              <span>Real-Time Events</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
              <span>Privacy Friendly Analytics</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;