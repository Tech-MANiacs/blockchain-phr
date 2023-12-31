import React from "react";
import axios from "axios";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {showLoading,hideLoading} from '../redux/features/alertSlice';
import { message } from 'antd';
import {contract} from '../web3';
import FileUploadComponent from "./FileUploadComponent";

const initialValues = {
    appointment: [{ doctorId: '', date: '', diagnosis: '', prescription: '', description: '', status: '' }],
    files: ['']
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

const AddRecordUser = ({currentPatient, doctor, phrID}) => {
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
          values.userId = currentPatient._id;
          console.log(values);
          try {
                dispatch(showLoading());
                console.log(currentPatient, doctor);
                const result = await axios.get('/api/v1/user/fetchphr', {
                    params: {
                    abhaId: currentPatient.abhaId,
                    isUser: true,
                    }
                });

                if(result.data.success === false){
                    message.error(result.data.message);
                }

                const phr = result.data.phr;
                phr.appointment = phr.appointment.concat(values.appointment);
                console.log("phr", phr, phrID, currentPatient._id);
                const res = await axios.post('/api/v1/user/updatephr', {...phr, phrId: phrID, userId: currentPatient._id});
                dispatch(hideLoading());
                
                if(res.data.success)
                {
                    
                    console.log(currentPatient.ethId);
                    await contract.sendHash(currentPatient.ethId, doctor.ethId, res.data.dataHash);
                    message.success(res.data.message);
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

   
    return (
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
                <div className="bg-gray-200 w-full my-4 px-2 rounded-md font-medium py-1">Files</div>
                  {formik.values.files.map((file, index) => (
                    <div key={index} className="flex w-full pl-2 my-1 space-x-2">
                      <div className="w-[10%] flex items-center">{index + 1}.</div>
                      <div className="w-[70%]">
                          <FileUploadComponent
                            onFileChange={(uploadedFile) =>
                              formik.setFieldValue(`files[${index}]`, uploadedFile)
                            }
                            file={file}
                          />
                      </div>
                      
                      {index >= 0 && (
                        <button
                          className="w-[20%] max-h-[40px] bg-blue-500 py-1 rounded-md text-white font-semibold"
                          type="button"
                          onClick={() => handleRemoveField('files', index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleAddField('files')}
                      className="m-2 bg-green-500 text-white font-semibold px-4 py-1 text-sm rounded-md"
                    >
                      Add File
                    </button>
                  </div>
                <div className="border-t-2 mt-4 w-full flex justify-center items-center">
                   <button type="submit" className="bg-blue-500 rounded-md text-white font-semibold py-1 px-2 mt-4">Submit</button>
                </div>
                
              </form>

    );
};

export default AddRecordUser;