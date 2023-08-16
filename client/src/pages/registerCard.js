import React from 'react'
import '../styles/RegisterStyles.css'
import { Form, Input, message } from 'antd';
import {useDispatch} from 'react-redux';
import {showLoading,hideLoading} from '../redux/features/alertSlice';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
const RegisterCard = () => {
    const navigate = useNavigate();

    //using this to show and hide the spinner
    const dispatch = useDispatch();
    
    const formik = useFormik({
        initialValues: {
          name: '',
          email: '',
          password: '',
          batch: '',
          semester: '',
          branch: '',
          rollNumber: '',
          phoneNumber: '',
        },

        onSubmit: async() => {
            console.log('submitting', formik.values);
            try {
                //we already added proxy in the package.json, now we have to add the further url of the rest end point
    
                //in server we have /api/v1/user and then in router file we have the route register.
                dispatch(showLoading());
                const res = await axios.post('/api/v1/user/register', formik.values);
                dispatch(hideLoading());
                // the above line of code will send the values to the backend using the rest api which we created 
    
                //as we created success boolean and message in registerController, we check if we get success as true
                // console.log("Hello", res.data.success, "Bye");
                if(res.data.success)
                {
    
                    //this message is method of antd, read docs
    
                    //and the message in res.data.message is the message that we created in the userCtrl 
                    message.success(res.data.message);
                    navigate('/login');
                }
                else{
                    message.error(res.data.message);
                }
            } catch (error) {
                dispatch(hideLoading());
                console.log(error);
                message.error("Something went wrong)");
            }
        },
        validationSchema: Yup.object().shape({
          email: Yup.string().email('Invalid email address').required('Required'),
        }),
      });

  return (
    <>
    
        <form onSubmit={formik.handleSubmit} method='post' className='sign-up-form mt-8'>
            <div className="text-2xl font-semibold mb-2 text-[#444]">Sign up</div>
            <div className="input-field">
                <i className="fas fa-user" />
                <input type="text" id="name" name="name" placeholder="Name" value={formik.values.name} onChange={formik.handleChange}/>
            </div>
            <div className="input-field rounded-full">
            <i className="fas fa-envelope" />
            <input type="email" id="email" name="email" placeholder="Email" value={formik.values.email} onChange={formik.handleChange} className=' rounded-full'/>
            </div>
            <div className="input-field">
            <i className="fas fa-user" />
            <input type="text" id="batch" name="batch" placeholder="Batch" value={formik.values.batch} onChange={formik.handleChange}/>
            </div>
            <div className="input-field">
            <i className="fas fa-user" />
            <input type="text" id="semester" name="semester" placeholder="Semester" value={formik.values.semester} onChange={formik.handleChange}/>
            </div>
            <div className="input-field">
            <i className="fas fa-user" />
            <input type="text" id="branch" name="branch" placeholder="Branch" value={formik.values.branch} onChange={formik.handleChange}/>
            </div>
            <div className="input-field">
            <i className="fas fa-user" />
            <input type="text" id="rollNumber" name="rollNumber" placeholder="Roll Number" value={formik.values.rollNumber} onChange={formik.handleChange}/>
            </div>
            <div className="input-field">
            <i className="fas fa-user" />
            <input type="text" id="phoneNumber" name="phoneNumber" placeholder="Phone Number" value={formik.values.phoneNumber} onChange={formik.handleChange}/>
            </div>
            <div className="input-field">
            <i className="fas fa-lock" />
            <input type="password" id="password" name="password" placeholder="Password" value={formik.values.password} onChange={formik.handleChange}/>
            </div>
            <input type="submit" className="btn" defaultValue="Sign up" />
            {/* <div className="flex w-[380px] items-center">
            <hr className="border-t border-gray-300 w-1/5" />
            <div className="w-3/5 flex justify-center text-gray-500 text-sm">Or sign up with Google</div>
            <hr className="border-t border-gray-300 w-1/5" />
            </div>
            <div className="flex shadow-md mb-2 items-center justify-center max-w-[380px] w-full bg-[#fbf7f7] mt-4 h-[55px] rounded-[55px]">
                <img src="google.png" className="w-[30px] mr-4" />
                <div className="font-semibold text-xl">Google</div>
            </div> */}
        </form>
          
    </>
  )
}

export default RegisterCard