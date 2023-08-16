import Layout from '../components/Layout'
import React from 'react'
import { Form, Row, Col, Input, TimePicker, message } from 'antd'
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {showLoading, hideLoading} from '../redux/features/alertSlice'
import axios from 'axios'
import moment from "moment";


const ApplyDoctor = () => {
    const {user} = useSelector(state=>state.user)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleFinish = async (values) => {
        console.log(values);
        try {
          dispatch(showLoading());
          const res = await axios.post(
            "/api/v1/user/apply-doctor",
            {
              ...values,
              userId: user._id,
              timings: [
                moment(values.timings[0]).format("HH:mm"),
                moment(values.timings[1]).format("HH:mm"),
              ],
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          dispatch(hideLoading());
          if (res.data.success) {
            message.success(res.data.message);
            navigate("/");
          } else {
            message.error(res.data.message);
          }
        } catch (error) {
          dispatch(hideLoading());
          console.log(error);
          message.error("Somthing Went Wrrong ");
        }
      };
    return (
        <Layout>
            <h1 className='text-center font-semibold text-xl py-1'>Apply as Doctor</h1>
            <Form layout='vertical' onFinish={handleFinish} className=" mt-4">
                <h4 className='bg-[#403333] rounded-lg py-1 w-full text-center text-white text-lg font-semibold mb-4'>Personal Details</h4>
                <div className='w-full'>
                    <div className="flex">
                        <div className="w-1/3 mr-1">
                            <Form.Item
                                label="First Name"
                                name="firstName"
                                required
                                rules={[{ required: true }]}

                                className="doctor-form-item"
                            >
                                <Input type="text" placeholder='Your first Name' />
                            </Form.Item>
                        </div>
                        <div className="w-1/3 mx-1">
                            <Form.Item
                                label="Last Name"
                                name="lastName"
                                required
                                rules={[{ required: true }]}
                                className="doctor-form-item"
                            >
                                <Input type="text" placeholder='Your last Name' />
                            </Form.Item>
                        </div>
                        <div className="w-1/3 ml-1">
                            <Form.Item
                                label="Phone No."
                                name="phone"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="text" placeholder='Your phone no.' />
                            </Form.Item>    
                        </div>
                    </div>
                    <div className="flex">
                        <div className="w-1/3 mr-1">
                            <Form.Item
                                label="E-mail"
                                name="email"
                                required
                                rules={[{ required: true }]}
                            >
                                <Input type="text" placeholder='email' />
                            </Form.Item>
                        </div>
                        <div className="w-1/3 mx-1">
                            <Form.Item
                                label="Website"
                                name="website"
                            >
                                <Input type="text" placeholder='website' />
                            </Form.Item>
                        </div>
                        <div className="w-1/3 ml-1">
                            <Form.Item
                                    label="Address"
                                    name="address"
                                    required
                                    rules={[{ required: true }]}
                                >
                                    <Input type="text" placeholder='Address' />
                            </Form.Item>    
                        </div>
                    </div>
                </div>

                <h4 className='bg-[#403333] rounded-lg py-1 w-full text-lg text-center text-white font-semibold mb-4'>Professional Details</h4>

                <div className='w-full'>
                    <div className="flex">
                        <div className="w-1/3 mr-1">
                            <Form.Item
                                label="Specialization"
                                name="specialization"
                                required
                                rules={[{ required: true }]}

                                className="doctor-form-item"
                            >
                                <Input type="text" placeholder='your specialization' />
                            </Form.Item>
                        </div>
                        <div className="w-1/3 mx-1">
                            <Form.Item
                                label="Experience"
                                name="experience"
                                required
                                rules={[{ required: true }]}
                                className="doctor-form-item"
                            >
                                <Input type="text" placeholder='your experience' />
                            </Form.Item>
                        </div>
                        <div className="w-1/3 ml-1">
                            <Form.Item
                                label="Timings"
                                name="timings"
                                required
                            >
                                <TimePicker.RangePicker format= "HH:mm" className='w-full' />
                            </Form.Item>
                        </div>
                    </div>
                    <div className="flex justify-center">
                    <button className='py-1 mt-4 hover:bg-blue-600 bg-blue-500 text-lg text-white font-semibold px-4 rounded-full'>SUBMIT</button>
                    </div>
                </div>
            </Form>
        </Layout>
    )
}

export default ApplyDoctor


//creating route for in app.js