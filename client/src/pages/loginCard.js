import React from 'react'
import '../styles/RegisterStyles.css'
import { Form, Input, message } from 'antd';
import {useDispatch} from 'react-redux';
import {showLoading,hideLoading} from '../redux/features/alertSlice';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const LoginCard = () => {

    const navigate = useNavigate();

    //using this to show and hide the spinner
    const dispatch = useDispatch();
    
    const formik = useFormik({
        initialValues: {
          email: '',
          password: '',
        },

        onSubmit: async() => {
            console.log('submitting', formik.values);
            try {
            
                dispatch(showLoading());
                const res = await axios.post("/api/v1/user/login", formik.values);
                window.location.reload();
                dispatch(hideLoading());
                //checking if everything went right with the boolean we passed in the login handler in userCtrl
                if(res.data.success){
                    //if it is success, saving token in the local storage
                    localStorage.setItem("token",res.data.token);
                    message.success("Login successfully")
                    navigate('/');
                }
                else{
                    message.error(res.data.message);
                }
                
            } catch (error) {
                dispatch(hideLoading());
                console.log(error);
                message.error("Something went wrong");
            }
        },
        validationSchema: Yup.object().shape({
          email: Yup.string().email('Invalid email address').required('Required'),
        }),
      });

  return (
    <>
   
            <form onSubmit={formik.handleSubmit} method='post' className='sign-in-form'>
              <h2 className="text-2xl font-semibold mb-2 text-[#444]">Sign in</h2>
              <div className="input-field">
            <i className="fas fa-envelope" />
            <input type="email" id="email" name="email" placeholder="Email" value={formik.values.email} onChange={formik.handleChange}/>
            </div>
              <div className="input-field">
                <i className="fas fa-lock" />
                <input type="password" id="password" name="password" placeholder="Password" value={formik.values.password} onChange={formik.handleChange} />
              </div>
              <input type="submit" defaultValue="Login" className="btn solid" />
              <div className="flex w-[380px] items-center">
                <hr className="border-t border-gray-300 w-1/5" />
                <div className="w-3/5 flex justify-center text-gray-500 text-sm">Or sign in with Google</div>
                <hr className="border-t border-gray-300 w-1/5" />
              </div>
              <div className="flex shadow-md mb-2 items-center justify-center max-w-[380px] w-full bg-[#fbf7f7] mt-4 h-[55px] rounded-[55px]">
                  <img src="google.png" className="w-[30px] mr-4" />
                  <div className="font-semibold text-xl">Google</div>
              </div>
            </form>

    </>
  )
}

export default LoginCard