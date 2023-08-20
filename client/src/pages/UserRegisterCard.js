import React, { useRef, useState } from 'react'
import '../styles/RegisterStyles.css'
import { message } from 'antd';
import {useDispatch} from 'react-redux';
import {showLoading,hideLoading} from '../redux/features/alertSlice';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import { Spinner } from "@material-tailwind/react";
import {contract} from '../web3';

const UserRegisterCard = ({toggleCard}) => {
   
    const navigate = useNavigate();
    const [abhaId, setAbhaId] = useState("");
    const [step, setStep] = useState(1); // Initial step is 1
    const passwordRef = useRef();
    const abhaRef = useRef();
    const reconfirmPasswordRef = useRef();
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const dispatch = useDispatch();
    const [isVerified, setIsVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const handleVerify = async () => {

        if (abhaRef.current.value === null) {
            message.error("Enter your ABHA ID");
            return;
        }

        // Start the verification process
        setVerifying(true);
        setAbhaId(abhaRef.current.value);
        try {
            const response = await axios.post('/api/v1/user/check-abhaid', { abhaId: abhaRef.current.value });
            console.log("gone");
            const { exists } = response.data;

            if (exists) {
                // ABHA ID exists, you can set verification state and show a success message
                setVerifying(false);
                setIsVerified(true);
                message.success('ABHA ID Verified');
                // Optionally, you can set other user data from 'abha' object
            } else {
                setVerifying(false);
                message.error('Invalid ABHA ID');
            }
        } catch (error) {
            setVerifying(false);
            console.error(error);
            message.error('Error verifying ABHA ID');
        }

    };
    

    const handleSubmit = async () => {
        if (passwordRef.current.value !== reconfirmPasswordRef.current.value) {
            setPasswordMatchError(true);
            return;
        }
        setPasswordMatchError(false);
        console.log(abhaId, passwordRef.current.value);

        try {
            dispatch(showLoading());
            const res = await axios.post('/api/v1/user/register', {
                abhaId : abhaId,
                password : passwordRef.current.value
            });
            dispatch(hideLoading());
           
            if(res.data.success)
            {
                message.success(res.data.message);
                console.log(res.data.ethId);
                const tx = await contract.giveAccess(res.data.ethId);
                console.log(tx);
                navigate('/userPortal');
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
            // Step 1: ABHA ID input
            <>
                <div className='flex justify-center mb-4' >
                    <img src="healthid.png" alt="" className='w-[40%]' />
                </div>
                
                <div className="mb-4">
                    <label className="block font-bold text-md mb-2" htmlFor="email">
                        Enter your ABHA Number
                    </label>
                    
                    <input
                        className="bg-white shadow-sm h-12 rounded w-full py-2 px-3 text-gray-600 focus:outline-none focus:shadow-outline"
                        id="abha"
                        name="abha"
                        type="text"
                        placeholder="ABHA Number"
                        ref={abhaRef}
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
                <div className='items-center flex w-1/2 justify-start font-bold text-md text-blue-400'>
                        Don't have an ABHA ID?
                </div>
                <div className="mt-2 mb-12 flex space-x-2">
                    <div className='w-1/2 text-md text-white font-semibold rounded-md cursor-pointer items-center justify-center flex bg-blue-500 hover:bg-blue-600 transition-colors duration-300' onClick={handleSubmit}>Create ABHA ID</div>
                    <div className='flex justify-center font-semibold my-1 text-lg text-gray-500'>OR</div>
                    <div className='w-1/2 text-md text-white font-semibold flex justify-center items-center rounded-md cursor-pointer bg-blue-500 hover:bg-blue-600 transition-colors duration-300' onClick={toggleCard}>Register with Aadhar</div>
                </div>
                
                <div className="mt-4">
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
                        <label className="block font-bold text-md mb-2" htmlFor="password">
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
                        <label className="block font-bold text-md mb-2" htmlFor="reconfirmpassword">
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

export default UserRegisterCard