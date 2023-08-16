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
import { FaHospital } from "react-icons/fa6";
import {Button} from "@material-tailwind/react";
const HospitalPortal = () => {
   
  return (
    <>
    <div className="w-2/3">
            <img src="hospitalLogin.jpg" alt="" className='h-[100%]' />
        </div>
        <div className="w-1/3 p-8 px-12 space-y-8 bg-gradient-to-r from-blue-700 to-blue-900">
            <div>
                <div className="flex justify-center mb-4"><FaHospital className='text-white text-[36px]'/></div>
                <div className='text-2xl font-semibold text-center text-white'>
                Healthcare Facilities 

                </div>
            </div>
            
            <div className="mb-4">
                <label className="block font-bold text-md mb-2 text-white" htmlFor="email">
                    Email ID
                </label>
                <input
                    className="bg-white shadow-sm h-12 rounded w-full py-2 px-3 text-gray-600 focus:outline-none focus:shadow-outline"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete='off'
                    // ref={}
                />
                </div>
                <div className="mb-8">
                <label className="block font-bold text-md mb-2 text-white" htmlFor="password">
                    Password
                </label>
                <input
                    className=" bg-white shadow-sm h-12 rounded w-full py-2 px-3 text-gray-600 focus:outline-none focus:shadow-outline"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    // ref={passwordRef}
                />
                </div>
                <div className="flex items-center justify-between">
                <div className='items-center flex'>
                    <a
                    className=" items-`center` font-bold text-sm text-blue-100 hover:text-blue-200"
                    href="/"
                    >
                    Forgot Password?
                    </a>
                </div>
                
                </div>
                <div className="mt-8">
                <Button className='w-full text-md bg-blue-400 hover:bg-blue-500'>LOG IN</Button>
                </div>
        </div>
    </>
  )
}

export default HospitalPortal