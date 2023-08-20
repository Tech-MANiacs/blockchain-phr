import React from 'react'
import '../styles/RegisterStyles.css'
import {Link} from 'react-router-dom';
import Home from './Home';
import UserPortal from './UserPortal';
import DoctorPortal from './DoctorPortal';
import HospitalPortal from './HospitalPortal';
import { Routes, Route } from "react-router-dom";
const LandingPage = () => {
   
  return (
    <>
    <div className='h-[5vh] '>
    </div>
    <div className='h-[10vh] bg-[#181c2c] flex'>
        <div className="w-1/4 flex items-center px-3 py-3">
            <img src="health.png" alt="health" className='h-[100%] cursor-pointer mr-4' />
            <div className='font-["Poppins"] text-white font-bold text-2xl cursor-pointer'>MEDICHAIN</div>
        </div>
        <div className="justify-end items-center text-md font-medium text-white w-3/4 flex">
          <Link to ="/"><div className="mx-4 hover:underline hover:underline-offset-4 p-2 px-4 rounded-md"> Home</div></Link>
          <Link to ="/"><div className="mx-4 hover:underline hover:underline-offset-4 p-2 px-4 rounded-md">About Us</div></Link>
          <Link to="/"><div className="mx-4 hover:underline hover:underline-offset-4 p-2 px-4 rounded-md">FAQs</div></Link>
          <Link to ="/"><div className="mx-4 hover:underline hover:underline-offset-4 p-2 px-4 rounded-md">Contact</div></Link>
        </div>
    </div>
    <div className='h-[85vh] flex'>
        <Routes>
            <Route path="/" element = {<Home />} />
            <Route path="/userPortal" element = {<UserPortal />} />
            <Route path="/doctorPortal" element = {<DoctorPortal />} />
            <Route path="/hospitalPortal" element = {<HospitalPortal />} />
        </Routes>
    </div>
    </>
  )
}

export default LandingPage