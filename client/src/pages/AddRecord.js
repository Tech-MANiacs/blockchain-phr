import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useFormik } from 'formik';
import {useSelector} from 'react-redux'
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {showLoading,hideLoading} from '../redux/features/alertSlice';
import { message } from 'antd';
import {contract} from '../web3';

const initialValues = {
    appointment: [{ doctorId: '', date: '', diagnosis: '', prescription: '', description: '', status: '' }]
  };
  
  const validationSchema = Yup.object({
    appointment: Yup.array().of(
      Yup.object().shape({
        doctorId: Yup.string(),
        date: Yup.date(),
        diagnosis: Yup.string(),
        prescription: Yup.string(),
        description: Yup.string(),
        status: Yup.string(),
      })
    )
  });

const AddRecord = () => {
    const dispatch = useDispatch();
    const {user} = useSelector(state=>state.user)

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
          values.userId = user._id;
          console.log(values);
          try {
                dispatch(showLoading());
                const result = await axios.get('/api/v1/user/fetchphr', {
                    params: {
                    abhaId: user.abhaId
                    }
                });

                if(result.data.success === false){
                    message.error(result.data.message);
                }

                const phr = result.data.phr;
                phr.appointment = phr.appointment.concat(values.appointment);
                console.log("phr", phr);
                const res = await axios.post('/api/v1/user/updatephr', {...values, phrId: user.phrId});
                dispatch(hideLoading());
                
                if(res.data.success)
                {
                    message.success(res.data.message);
                    console.log(user.ethId);
                    const tx = await contract.sendHash(user.ethId, user.ethId, res.data.dataHash);
                    console.log(tx);
                    console.log(res.data);
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
      });
    
      const handleAddField = (fieldName) => {
        formik.setFieldValue(fieldName, [...formik.values[fieldName], '']);
      };
    
      const handleRemoveField = (fieldName, index) => {
        const updatedValues = [...formik.values[fieldName]];
        updatedValues.splice(index, 1);
        formik.setFieldValue(fieldName, updatedValues);
      };

    const fetchPhr = async() => {
        try {
            dispatch(showLoading());
            console.log(user.abhaId);
            const res = await axios.get('/api/v1/user/fetchphr', {
                params: {
                  abhaId: user.abhaId
                }
              });
            dispatch(hideLoading());
        
            if(res.data.success)
            {
                message.success(res.data.message);
                console.log(res.data.phr);
                console.log(res.data.hash);
            }
            else{
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error("Something went wrong)");
        }
    }
    return (
        <Layout>
            <div className="flex justify-center w-full">
            <div className="h-fit w-[70%] rounded-xl bg-white shadow-sm">
              <form onSubmit={formik.handleSubmit} className="w-full p-4">
                
                {/* Appointment */}
                <div className="bg-gray-200 w-full my-4 px-2 rounded-md font-medium py-1">Appointments</div>
                <div className="w-full">
                  {formik.values.appointment.map((appoint, index) => (
                    <div key={index} className="flex pl-2 my-3 space-x-2">
                      <div className="w-[5%] flex items-top">{index+1}.</div>
                      <div className="w-[75%]">
                          <div className="space-x-2 mb-1">
                              <input
                                type="text"
                                placeholder="Doctor ID"
                                onChange={(e) => formik.setFieldValue(`appointment[${index}].doctorId`, e.target.value)}
                                value={appoint.doctorId}
                                className="w-[50%] border rounded-md px-2 py-1"
                              />
                              <input
                                type="date"
                                placeholder="Date"
                                onChange={(e) => formik.setFieldValue(`appointment[${index}].date`, e.target.value)}
                                value={appoint.date}
                                className="w-[48%] border rounded-md px-2 py-1"
                              />
                          </div>
                          <div className="mb-1">
                              <input
                                type="text"
                                placeholder="Diagnosis"
                                onChange={(e) => formik.setFieldValue(`appointment[${index}].diagnosis`, e.target.value)}
                                value={appoint.diagnosis}
                                className="w-[50%] border rounded-md px-2 py-1"
                              />
                              <select
                                id="status"
                                name="status"
                                onChange={(e) => formik.setFieldValue(`appointment[${index}].status`, e.target.value)}                    
                                value={appoint.status}
                                className="border w-[48%] ml-2 rounded-md px-2 py-1 "
                              >
                                <option value="" label="Select Status" />
                                <option value="Ongoing" label="Ongoing" />
                                <option value="Cured" label="Cured" />
                              </select>
                          </div>
                          <div className="space-x-2 mb-1">
                              <input
                                type="text"
                                placeholder="Description"
                                onChange={(e) => formik.setFieldValue(`appointment[${index}].description`, e.target.value)}
                                value={appoint.description}
                                className="w-[100%] border rounded-md px-2 py-1"
                              />
                          </div>
                          <div className="space-x-2">
                              <input
                                type="text"
                                placeholder="Prescription"
                                onChange={(e) => formik.setFieldValue(`appointment[${index}].prescription`, e.target.value)}
                                value={appoint.prescription}
                                className="w-[100%] border rounded-md px-2 py-1"
                              />
                          </div>
                      </div>
                      
                      {/* More fields for Medications */}
                      <div className="w-[20%] flex">
                        <button className="bg-blue-500 w-full h-[23%] rounded-md text-white font-semibold" type="button" onClick={() => handleRemoveField('appointment', index)}>
                          Remove
                        </button>
                      </div>
                      
                    </div>
                  ))}
                  <div className="flex justify-center">
                    <button type="button" onClick={() => handleAddField('appointment')} className="m-2 bg-green-500 text-white font-semibold px-4 py-1 text-sm rounded-md">
                      Add Appointment
                    </button>
                  </div>
                </div>

                <div className="border-t-2 mt-4 w-full flex justify-center items-center">
                   <button type="submit" className="bg-blue-500 rounded-md text-white font-semibold py-1 px-2 mt-4">Submit</button>
                </div>
                
              </form>
          </div>
            </div>
            
        </Layout>
    );
};

export default AddRecord;