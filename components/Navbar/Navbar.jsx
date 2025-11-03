"use client"
import React from 'react'
import Image from 'next/image'
import { useState } from 'react';
import { TbWorld } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { Button, Select } from '@/components/ui';

function Navbar() {
    const [language,setLanguage] = useState("en");
    const handleChange = (e) => {
        setLanguage(e.target.value);
    }
  return (
    <nav className="w-full h-16 sm:h-20 bg-gray-950 flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Logo */}
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
          <Image
            src="/img/icon.png"
            alt="Icon for Freight Calculator"
            fill
            className="object-cover"
          />
        </div>

        {/* Text */}
        <div className="hidden sm:block">
          <p className="text-white font-semibold text-base sm:text-lg">Cargo Credible</p>
          <p className='text-xs sm:text-sm text-gray-500 font-light'>Advanced Rate Calculator</p>
        </div>

        {/* Mobile: Just show name */}
        <div className="sm:hidden">
          <p className="text-white font-semibold text-sm">Cargo Credible</p>
        </div>
      </div>

      <div className='flex items-center gap-2 sm:gap-3'>
        {/* Language Selector */}
        <div className='hidden md:flex items-center gap-1'>
          <TbWorld className="text-gray-400" size={18}/>
          <select
            value={language}
            onChange={handleChange}
            className='bg-transparent text-white text-sm px-2 py-1 rounded border border-gray-700 focus:outline-none focus:border-blue-500'
          >
            <option className='text-black bg-white' value="en">English</option>
            <option className='text-black bg-white' value="fr">French</option>
            <option className='text-black bg-white' value="es">Spanish</option>
          </select>
        </div>

        {/* Sign In Button */}
        <Button
          size="sm"
          icon={<CgProfile />}
          iconPosition="left"
          className="text-xs sm:text-sm"
        >
          <span className="hidden sm:inline">Sign In</span>
          <span className="sm:hidden">Sign In</span>
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;



