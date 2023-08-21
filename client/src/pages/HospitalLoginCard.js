import React, { useRef, useState } from 'react'
import '../styles/RegisterStyles.css'
import { message } from 'antd';
import {useDispatch} from 'react-redux';
import {showLoading,hideLoading} from '../redux/features/alertSlice';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const HospitalLoginCard = ({toggleCard}) => {
   
    const navigate = useNavigate();
    const emailRef = useRef();
    const passwordRef = useRef();
    const mobileRef = useRef();
    const dispatch = useDispatch();

    const [isEmail, setIsEmail] = useState(true);

    const handleToggleInput = (type) => {
        if (type === 'email') {
            setEmailValue('');
            setIsEmail(true);
        } else if (type === 'mobile') {
            setPhoneValue('');
            setIsEmail(false);
        }
    };

    const [emailValue, setEmailValue] = useState('');
    const [mobileValue, setPhoneValue] = useState('');

    const handleInputChange = (e) => {
        if (isEmail) {
            setEmailValue(e.target.value);
        } else {
            setPhoneValue(e.target.value);
        }
    };

    const handleSubmit = async () => {
        try {
            dispatch(showLoading());

            const formData = {
                password: passwordRef.current.value,
            };

            if (isEmail) {
                formData.email = emailValue;
                formData.isEmail = true;
            } else {
                formData.mobile = mobileValue;
                formData.isEmail = false;
            }

            console.log(formData);
            const res = await axios.post('/api/v1/hospital/login', formData);
            dispatch(hideLoading());

            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                message.success('Login successfully');
                navigate('/dashboard');
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error('Something went wrong');
        }
    };

  return (
    <>

            <div className='flex justify-center mb-4' >
                <img src="userlogincard.png" alt="" className='w-[40%]' />
            </div>
            

            <div className="bg-green-500 rounded-xl flex mx-8 mb-8 font-semibold space-x-1">
                <div className="flex m-1 w-full space-x-1">
                    <div
                        className={`w-1/2 flex justify-center rounded-lg py-1 transition-colors duration-300 items-center cursor-pointer ${
                            isEmail ? 'bg-white' : 'hover:bg-green-600'
                        }`}
                        onClick={() => handleToggleInput('email')}
                    >
                        Email ID
                    </div>
                    <div
                        className={`w-1/2 flex justify-center rounded-lg py-1 transition-colors duration-300 items-center cursor-pointer ${
                            isEmail ? 'hover:bg-green-600' : 'bg-white hover:bg-green-100'
                        }`}
                        onClick={() => handleToggleInput('mobile')}
                    >
                        Mobile
                    </div>
                </div>
            </div>
            
            <div className="mb-4 px-8">
                {
                    isEmail ?
                        <input
                            className="bg-white shadow-sm h-12 rounded w-full py-2 px-3 text-gray-600 focus:outline-none focus:shadow-outline"
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            ref={emailRef}
                            value={emailValue}
                            onChange={handleInputChange}
                        />
                     : 
                     
                        <input
                            className="bg-white shadow-sm h-12 rounded w-full py-2 px-3 text-gray-600 focus:outline-none focus:shadow-outline"
                            id="mobile"
                            name="mobile"
                            type="text"
                            placeholder="Enter your mobile"
                            ref={mobileRef}
                            value={mobileValue}
                            onChange={handleInputChange}
                        />
                }
                
            </div>
            <div className="mb-8 px-8">
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
                    className=" items-`center` font-bold text-sm text-blue-300 hover:text-white"
                    href="/"
                    >
                    Forgot Password?
                    </a>
                </div>
                
                </div>
                <div className="mt-8 px-8">
                <div className='w-full text-md text-white font-semibold px-4 text-center rounded-md cursor-pointer py-2 bg-blue-500 hover:bg-blue-600 transition-colors duration-300' onClick={handleSubmit}>LOGIN</div>
            </div>
            <div className="mt-4 px-8">
                <div className='w-full text-md text-white font-semibold px-4 text-center rounded-md cursor-pointer py-2 bg-green-500 hover:bg-green-600 transition-colors duration-300' onClick={toggleCard}>Not Registered? REGISTER</div>
            </div>

        
    </>
  )
}

export default HospitalLoginCard