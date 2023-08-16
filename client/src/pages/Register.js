import React from 'react';
import '../styles/RegisterStyles.css'
import { Form, Input, message } from 'antd';
import {useDispatch} from 'react-redux';
import {showLoading,hideLoading} from '../redux/features/alertSlice';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const onfinishHandler = async (values) => {
        try {
            //we already added proxy in the package.json, now we have to add the further url of the rest end point

            //in server we have /api/v1/user and then in router file we have the route register.
            dispatch(showLoading());
            const res = await axios.post('/api/v1/user/register', values);
            dispatch(hideLoading());
            // the above line of code will send the values to the backend using the rest api which we created 

            //as we created success boolean and message in registerController, we check if we get success as true
            if(res.data.success)
            {

                //this message is method if antd, read docs

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
            message.error("Something went wrong");
        }
    };
    
  return (
    <>
    <div className="form-container">
        <Form method='post' className='register-form' layout='vertical' onFinish={onfinishHandler}>

            {/* used bootstrap class text center */}
            <h1 className='text-center'>Register form</h1>
            <Form.Item label= "Name" name="name">
                <Input type="text" required/>
            </Form.Item>

            <Form.Item label= "Email" name="email" className='rounded-full'>
                <Input type="email" className='rounded-full' required/>
            </Form.Item>

            <Form.Item label= "Password" name="password">
                <Input type="password" required/>
            </Form.Item>

            {/* m-2 is a bootstrap class for margin of 2px */}

            {/* link is used to navigate to other page in react  it is available in react-router-dom*/}
            
            <Link to ="/login" className='m-2'>Already registered? click here </Link>
            <button className='btn btn-primary' type='submit'>Register</button>
        </Form>
    </div>
    </>
  )
}

export default Register

