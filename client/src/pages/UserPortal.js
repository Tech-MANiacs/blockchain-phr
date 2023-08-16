import React, { useRef } from 'react'
import '../styles/RegisterStyles.css'
import { Form, Input, message } from 'antd';
import {useDispatch} from 'react-redux';
import {showLoading,hideLoading} from '../redux/features/alertSlice';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import { FaCircleUser } from "react-icons/fa6";
import {Button} from "@material-tailwind/react";
import { useFormik } from 'formik';
import * as Yup from 'yup';

const UserPortal = () => {
   
    const navigate = useNavigate();
    const emailRef = useRef();
    const passwordRef = useRef();
    //using this to show and hide the spinner
    const dispatch = useDispatch();
    
    const handleSubmit = async () => {
        try {
            dispatch(showLoading());
           
            const res = await axios.post("/api/v1/user/login", 
            {
                email: emailRef.current.value,
                password: passwordRef.current.value,
            });
            dispatch(hideLoading());
            
            //checking if everything went right with the boolean we passed in the login handler in userCtrl
            if(res.data.success){
                //if it is success, saving token in the local storage
                localStorage.setItem("token",res.data.token);
                message.success("Login successfully")
                navigate('/dashboard');
            }
            else{
                message.error(res.data.message);
            }
            
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error("Something went wrong");
        }
      };

  return (
    <>
    <div className="w-[40%] p-8 px-12 bg-blue-100">
            <div className='flex justify-center items-center mb-8'>
                <FaCircleUser className='text-[24px] text-blue-700'/>
                <div className='ml-4 text-2xl font-medium text-center'>
                Registration

                </div>
            </div>
            
            <div className="mb-4 px-8">
                <label className="block font-bold text-md mb-2" htmlFor="email">
                    Enter your ABHA Number
                </label>
                
                <input
                    className="bg-white shadow-sm h-12 rounded w-full py-2 px-3 text-gray-600 focus:outline-none focus:shadow-outline"
                    id="abha"
                    name="abha"
                    type="text"
                    placeholder="ABHA Number"
                    // ref={abhaRef}
                />
            </div>
            <div className="flex items-center justify-between px-8">
                <div className='items-center flex w-1/2 justify-start font-bold text-sm text-blue-400'>
                    Don't have an ABHA ID?
                </div>
                <div className='items-center flex w-1/2 justify-end'>
                    <a
                    className="items-center font-bold text-sm text-blue-400 hover:text-blue-700"
                    href="/"
                    >
                    Create ABHA ID
                    </a>
                </div>
            </div>
            <div className='flex justify-center font-semibold my-2 text-lg'>OR</div>
            <div className="mb-4 px-8">
                <label className="block font-bold text-md mb-2" htmlFor="email">
                    Enter your Aadhar Number
                </label>
                
                <input
                    className="bg-white shadow-sm h-12 rounded w-full py-2 px-3 text-gray-600 focus:outline-none focus:shadow-outline"
                    id="abha"
                    name="abha"
                    type="text"
                    placeholder="Aadhar Number"
                    // ref={abhaRef}
                />
            </div>
            <div className="mb-8 px-8">
                <label className="block font-bold text-md mb-2" htmlFor="password">
                    Password
                </label>
                <input
                    className=" bg-white shadow-sm h-12 rounded w-full py-2 px-3 text-gray-600 focus:outline-none focus:shadow-outline"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    ref={passwordRef}
                />
            </div>
                <div className="flex items-center justify-between px-8">
                <div className='items-center flex'>
                    <a
                    className=" items-`center` font-bold text-sm text-blue-400 hover:text-blue-700"
                    href="/"
                    >
                    Forgot Password?
                    </a>
                </div>
                
                </div>
                <div className="mt-8 px-8">
                <Button className='w-full text-md bg-blue-500 hover:bg-blue-600' onClick={handleSubmit}>LOG IN</Button>
                </div>
                <div className="mt-4 px-8">
                <Button className='w-full text-md bg-green-500 hover:bg-green-600' onClick={handleSubmit}>NOT REGISTERED? CLICK HERE</Button>
                </div>
            </div>
        <div className="w-[60%] flex items-center justify-center">
            <img src="userLogin.png" alt="" className='h-[80%]' />
        </div>
        
        
    </>
  )
}

export default UserPortal