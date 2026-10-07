import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-lg bg-black slidedown border-b border-white/5">
      <div className="px-6 md:px-20 py-4 flex items-center justify-between ">
        <div className="flex-1 flex items-center">
          <Link
            to="/"
            className="text-2xl md:text-3xl font-bold tracking-tight"
            style={{ fontFamily: 'cursive' }}
          >
            <span className="text-white">Dealwaaale</span><span className="text-emerald-500">.in</span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 justify-center items-center gap-8 text-sm font-medium text-white">
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>
          <Link to="#about" className="hover:text-white transition">
            About
          </Link>
          <Link to="#services" className="hover:text-white transition flex items-center gap-1.5 group">
            Services
          </Link>
          <Link to="#contact" className="hover:text-white transition flex items-center gap-1.5 group">
            Companies Motive
          </Link>
          <Link to="#meet-the-team" className="hover:text-white transition flex items-center gap-1.5 group">
            Developers Connect
          </Link>
        </div>

        <div className="flex-1 flex justify-end items-center gap-4 md:gap-5 text-sm">
          <Link to="/login" className="text-white hover:text-white/70 transition font-medium">
            Login
          </Link>

          <Link
            to="/register"
            className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-white text-black font-medium transition active:scale-[0.98] hover:bg-neutral-200"
          >
            Explore Now
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
