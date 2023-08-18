import React from 'react'
import '../styles/RegisterStyles.css'
import { Form, Input, message } from 'antd';
import {useDispatch} from 'react-redux';
import {showLoading,hideLoading} from '../redux/features/alertSlice';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import LoginCard from './loginCard';
import RegisterCard from './registerCard';
import TopBar from './TopBar';
const Home = () => {
   
  return (
    <>
    <div className='bg-[url("../public/bg.jpg")] bg-cover w-full flex relative'>
  <div className="absolute inset-0 bg-black/[10%] z-0"></div>
  <div className="w-1/3 h-full pl-11 py-12 relative z-10">
    <Link to="/userPortal">
      <div className="h-1/4 mb-12 flex shadow-lg backdrop-blur-sm saturate-[171%] bg-[#062155]/[0.71] border-[1px] border-solid border-white/[0.525] rounded-xl cursor-pointer hover:bg-[#062155]/[0.81] transition-colors duration-300">
        <div className="w-3/5 p-4">
          <div className='text-white font-bold text-2xl'>USERS</div>
        </div>
        <div className='w-2/5 flex items-center justify-center'>
          <img src="user.png" alt="user" className='h-[100%]' />
        </div>
      </div>
    </Link>
    <Link to="/doctorPortal">
  <div className="h-1/4 mb-12 flex shadow-lg backdrop-blur-sm saturate-[171%] bg-[#062155]/[0.71] border-[1px] border-solid border-white/[0.525] rounded-xl cursor-pointer hover:bg-[#062155]/[0.81] transition-colors duration-300">
    <div className="w-3/5 p-4">
      <div className='text-white font-bold text-2xl'>HEALTHCARE PROFESSIONALS</div>
    </div>
    <div className='w-2/5 flex items-center justify-center pt-2'>
      <img src="doctor.png" alt="user" className='h-[100%]' />
    </div>
  </div>
</Link>
<Link to="/hospitalPortal">
  <div className="h-1/4 flex shadow-lg backdrop-blur-sm saturate-[171%] bg-[#062155]/[0.71] border-[1px] border-solid border-white/[0.525] rounded-xl cursor-pointer hover:bg-[#062155]/[0.81] transition-colors duration-300">
    <div className="w-3/5 p-4">
      <div className='text-white font-bold text-2xl'>HEALTHCARE FACILITIES</div>
    </div>
    <div className='w-2/5 flex items-center justify-center pt-4'>
      <img src="hospital.png" alt="user" className='h-[100%]' />
    </div>
  </div>
</Link>

  </div>
  <div className="w-2/3 h-full pt-12 relative z-10">
    {/* Other content */}
  </div>
</div>

    </>
  )
}

export default Home