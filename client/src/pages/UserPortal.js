import React, { useRef, useState } from 'react'
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
import UserLoginCard from './UserLoginCard';
import UserRegisterCard from './UserRegisterCard';

const UserPortal = () => {
    const [isLogin, setLogin] = useState(true); // 'login' or 'register'

    const toggleCard = () => {
      setLogin(!isLogin);
    };
    
  return (
    <>
        <div className="w-[40%] p-8 px-12 bg-blue-100">
            {isLogin ? <UserLoginCard toggleCard={toggleCard} /> : <UserRegisterCard toggleCard={toggleCard} />}
        </div>
        <div className="w-[60%] pt-4 items-center justify-center">
            <div className="flex justify-center items-center ">
                <img src="userLogin.png" alt="" className='h-[90%]' />
            </div>
        </div>
    </>
  )
}

export default UserPortal