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
const Login = () => {
    const [isSignUpMode, setIsSignUpMode] = useState(false);

    const handleSignUpClick = () => {
        setIsSignUpMode(true);
    };

    const handleSignInClick = () => {
        setIsSignUpMode(false);
    };

  return (
    <>
    <div>
      
    </div>
    </>
  )
}

export default Login