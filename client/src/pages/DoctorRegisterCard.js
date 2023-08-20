import React, { useRef, useState } from 'react'
import '../styles/RegisterStyles.css'
import { message } from 'antd';
import {useDispatch} from 'react-redux';
import {showLoading,hideLoading} from '../redux/features/alertSlice';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import { Spinner } from "@material-tailwind/react";

const DoctorRegisterCard = ({toggleCard}) => {
   
    const navigate = useNavigate();
    const [doctorId, setDoctorId] = useState("");
    const [step, setStep] = useState(1); // Initial step is 1
    const passwordRef = useRef();
    const doctorRef = useRef();
    const reconfirmPasswordRef = useRef();
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const dispatch = useDispatch();
    const [isVerified, setIsVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const handleVerify = async () => {

        if (doctorRef.current.value === null) {
            message.error("Enter your Healthcare Professional ID");
            return;
        }

        // Start the verification process
        setVerifying(true);
        setDoctorId(doctorRef.current.value);
        try {
            const response = await axios.post('/api/v1/doctor/check-doctorid', { doctorId: doctorRef.current.value });
            console.log("gone");
            const { exists } = response.data;

            if (exists) {
                // Healthcare Professional ID exists, you can set verification state and show a success message
                setVerifying(false);
                setIsVerified(true);
                message.success('Healthcare Professional ID Verified');
                // Optionally, you can set other user data from 'doctor' object
            } else {
                setVerifying(false);
                message.error('Invalid Healthcare Professional ID');
            }
        } catch (error) {
            setVerifying(false);
            console.error(error);
            message.error('Error verifying Healthcare Professional ID');
        }

    };
    

    const handleSubmit = async () => {
        if (passwordRef.current.value !== reconfirmPasswordRef.current.value) {
            setPasswordMatchError(true);
            return;
        }
        setPasswordMatchError(false);
        console.log(doctorId, passwordRef.current.value);

        try {
            dispatch(showLoading());
            const res = await axios.post('/api/v1/doctor/register', {
                doctorId : doctorId,
                password : passwordRef.current.value
            });
            dispatch(hideLoading());
           
            if(res.data.success)
            {
                message.success(res.data.message);
                navigate('/doctorPortal');
            }
            else{
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error("Something went wrong)");
        }
      };

  return (
    <>
        {step === 1 && (
            // Step 1: Healthcare Professional ID input
            <>
                <div className='flex justify-center mb-4' >
                    <img src="healthid.png" alt="" className='w-[40%]' />
                </div>
                
                <div className="mb-4">
                    <label className="block text-white font-bold text-md mb-2" htmlFor="email">
                        Enter your Healthcare Professional ID
                    </label>
                    
                    <input
                        className="bg-white shadow-sm h-12 rounded w-full py-2 px-3 text-gray-600 focus:outline-none focus:shadow-outline"
                        id="doctor"
                        name="doctor"
                        type="text"
                        placeholder="Healthcare Professional ID"
                        ref={doctorRef}
                    />
                </div>
                <div className="mt-4 mb-12 flex">
                    <div className='w-1/2'>
                    <div
                        className={`w-fit flex justify-start text-md text-white font-semibold px-4 text-center rounded-full items-center py-1 ${
                            isVerified ? 'bg-green-500' : 'bg-blue-500 cursor-pointer hover:bg-blue-600'
                        } transition-colors duration-300`}
                        onClick={isVerified ? () => null : handleVerify}
                    >
                        {verifying ? (
                            <>
                                <span className="ml-1 mr-2">Verifying</span>
                                <Spinner className="h-5 w-5 animate-spin text-gray-900/50" color="white" />   
                            </>
                        ) : (
                            (isVerified === true) ? 'Verified' : (isVerified === false) ? 'Verify' : 'Verifying'
                        )}
                    </div>
                    </div>
                    <div className='w-1/2 justify-end flex'>
                        <div
                            className={`w-fit flex justify-start text-md text-white font-semibold px-4 text-center rounded-full cursor-pointer py-1 ${
                                isVerified ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 pointer-events-none'
                            } transition-colors duration-300`}
                            onClick={isVerified ? () => setStep(2) : null}
                        >
                            {"Next >"}
                        </div>
                    </div>
                </div>
                <div className='items-center flex justify-start font-bold text-md text-blue-200'>
                        Don't have a Healthcare Professional ID?
                </div>
                <div className="mt-2 mb-12 flex space-x-2">
                    <div className='w-full py-1 text-md text-white font-semibold rounded-md cursor-pointer items-center justify-center flex bg-blue-500 hover:bg-blue-600 transition-colors duration-300'>Create Healthcare Professional ID</div>
                   
                </div>
                
                <div className="mt-4 border-t-2 pt-4">
                    <div className='w-full text-md text-white font-semibold px-4 text-center rounded-md cursor-pointer py-2 bg-green-500 hover:bg-green-600 transition-colors duration-300' onClick={toggleCard}>Already Registered? LOG IN</div>
                </div>
            </>
            )}
            {step === 2 && (
                // Step 2: Password input
                <>
                    <div className='flex justify-center mb-4' >
                        <img src="healthid.png" alt="" className='w-[40%]' />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block font-bold text-md mb-2 text-white" htmlFor="password">
                            Create password
                        </label>
                        
                        <input
                            className="bg-white shadow-sm h-12 rounded w-full py-2 px-3 text-gray-600 focus:outline-none focus:shadow-outline"
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            ref={passwordRef}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold text-md mb-2 text-white" htmlFor="reconfirmpassword">
                            Confirm Password
                        </label>
                        
                        <input
                            className="bg-white shadow-sm h-12 rounded w-full py-2 px-3 text-gray-600 focus:outline-none focus:shadow-outline"
                            id="reconfirmpassword"
                            name="reconfirmpassword"
                            type="reconfirmpassword"
                            placeholder="Password"
                            ref={reconfirmPasswordRef}
                        />
                        {passwordMatchError && (
                            <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                        )}
                    </div>
                    
                    <div className="mt-12">
                        <div className='w-full text-md text-white font-semibold px-4 text-center rounded-md cursor-pointer py-2 bg-blue-500 hover:bg-blue-600 transition-colors duration-300' onClick={handleSubmit}>REGISTER</div>
                    </div>
                    <div className="mt-2">
                        <div className='w-full text-md text-white font-semibold px-4 text-center rounded-md cursor-pointer py-2 bg-green-500 hover:bg-green-600 transition-colors duration-300' onClick={toggleCard}>Already Registered? LOG IN</div>
                    </div>
                </>
            )}
    </>
  )
}

export default DoctorRegisterCard