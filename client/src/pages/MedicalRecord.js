import React from "react";
import axios from "axios";
import { useFormik } from 'formik';
import {useSelector} from 'react-redux'
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {showLoading,hideLoading} from '../redux/features/alertSlice';
import { message } from 'antd';
import {contract} from '../web3';
import FileUploadComponent from "./FileUploadComponent";

const initialValues = {
  bloodType: '',
  allergies: [''],
  conditions: [''],
  familyHistory: [''],
  medications: [{ name: '', dosage: '', frequency: '', startDate: '', status: '' }],
  appointment: [{ doctorId: '', date: '', diagnosis: '', prescription: '', description: '', status: '' }],
  vaccinations: [{ name: '', date: '' }],
  surgeries: [{ name: '', date: '' }],
  files: ['']
};

const validationSchema = Yup.object({
  bloodType: Yup.string().required('Required'),
  allergies: Yup.array().of(Yup.string()),
  conditions: Yup.array().of(Yup.string()),
  familyHistory: Yup.array().of(Yup.string()),
  medications: Yup.array().of(
    Yup.object().shape({
      name: Yup.string(),
      dosage: Yup.string(),
      frequency: Yup.string(),
      startDate: Yup.date(),
      status: Yup.string(),
    })
  ),
  appointment: Yup.array().of(
    Yup.object().shape({
      doctorId: Yup.string(),
      date: Yup.date(),
      diagnosis: Yup.string(),
      prescription: Yup.string(),
      description: Yup.string(),
      status: Yup.string(),
    })
  ),
  vaccinations: Yup.array().of(
    Yup.object().shape({
      name: Yup.string(),
      date: Yup.date(),
    })
  ),
  surgeries: Yup.array().of(
    Yup.object().shape({
      name: Yup.string(),
      date: Yup.date(),
    })
  ),
});

const MedicalRecord = () => {
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
          const res = await axios.post('/api/v1/user/storephr', values);
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

  return (
      <div className="">
        <div className="font-semibold p-2 text-lg text-red-600">You haven't added any records yet</div>
        <div className="flex">
          <div className="h-fit w-[60%] rounded-xl bg-white shadow-sm">
              <form onSubmit={formik.handleSubmit} className="w-full p-4">
                {/* Blood Type */}
                <div className="w-full flex">
                  <label htmlFor="bloodType" className="font-semibold px-2 w-1/2">Blood Type</label>
                  <select
                    id="bloodType"
                    name="bloodType"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.bloodType}
                    className="border rounded-md px-2 font-medium text-gray-500"
                  >
                    <option value="" label="Select Blood Type" />
                    <option value="A+" label="A+" />
                    <option value="A-" label="A-" />
                    <option value="B+" label="B+" />
                    <option value="B-" label="B-" />
                    <option value="O+" label="O+" />
                    <option value="O-" label="O-" />
                    <option value="AB+" label="AB+" />
                    <option value="AB-" label="AB-" />
                    <option value="Unknown" label="Unknown" />
                  </select>
                  {formik.touched.bloodType && formik.errors.bloodType && <div className="text-red-500 text-sm font-medium flex items-center ml-2">{formik.errors.bloodType}</div>}
                </div>

                {/* Allergies */}
                <div className="bg-gray-200 w-full my-4 px-2 rounded-md font-medium py-1">Allergies</div>
                <div className="w-full">
                  {formik.values.allergies.map((allergy, index) => (
                    <div key={index} className="flex pl-2 my-1 space-x-2">
                      <div className="w-[10%] flex items-center">{index+1}.</div>
                      <input
                        type="text"
                        onChange={(e) => formik.setFieldValue(`allergies[${index}]`, e.target.value)}
                        value={allergy}
                        className="w-[70%] border rounded-md px-2"
                      />
                      {index >= 0 && (
                        <button className="w-[20%] bg-blue-500 py-1 rounded-md text-white font-semibold" type="button" onClick={() => handleRemoveField('allergies', index)}>
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="flex justify-center">
                    <button type="button" onClick={() => handleAddField('allergies')} className="m-2 bg-green-500 text-white font-semibold px-4 py-1 text-sm rounded-md">
                      Add Allergy
                    </button>
                  </div>
                  
                </div>

                {/* Conditions */}
                <div className="bg-gray-200 w-full my-4 px-2 rounded-md font-medium py-1">Conditions</div>
                <div className="w-full">
                  {formik.values.conditions.map((condition, index) => (
                    <div key={index} className="flex pl-2 my-1 space-x-2">
                      <div className="w-[10%] flex items-center">{index+1}.</div>
                      <input
                        type="text"
                        onChange={(e) => formik.setFieldValue(`conditions[${index}]`, e.target.value)}
                        value={condition}
                        className="w-[70%] border rounded-md px-2"
                      />
                      {index >= 0 && (
                        <button className="w-[20%] bg-blue-500 py-1 rounded-md text-white font-semibold" type="button" onClick={() => handleRemoveField('conditions', index)}>
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="flex justify-center">
                    <button type="button" onClick={() => handleAddField('conditions')} className="m-2 bg-green-500 text-white font-semibold px-4 py-1 text-sm rounded-md">
                      Add Condition
                    </button>
                  </div>
                </div>

                {/* Family History */}
                <div className="bg-gray-200 w-full my-4 px-2 rounded-md font-medium py-1">Family History</div>
                <div className="w-full">
                  {formik.values.familyHistory.map((history, index) => (
                    <div key={index} className="flex pl-2 my-1 space-x-2">
                      <div className="w-[10%] flex items-center">{index+1}.</div>
                      <input
                        type="text"
                        onChange={(e) => formik.setFieldValue(`familyHistory[${index}]`, e.target.value)}
                        value={history}
                        className="w-[70%] border rounded-md px-2"
                      />
                      {index >= 0 && (
                        <button className="w-[20%] bg-blue-500 py-1 rounded-md text-white font-semibold"  type="button" onClick={() => handleRemoveField('familyHistory', index)}>
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="flex justify-center">
                    <button type="button" onClick={() => handleAddField('familyHistory')} className="m-2 bg-green-500 text-white font-semibold px-4 py-1 text-sm rounded-md">
                      Add Family History
                    </button>
                  </div>
                </div>

                {/* Medications */}
                <div className="bg-gray-200 w-full my-4 px-2 rounded-md font-medium py-1">Medications</div>
                <div className="w-full">
                  {formik.values.medications.map((medication, index) => (
                    <div key={index} className="flex pl-2 my-3 space-x-2">
                      <div className="w-[5%] flex items-top">{index+1}.</div>
                      <div className="w-[75%]">
                          <div className="space-x-2 mb-1">
                              <input
                                type="text"
                                placeholder="Name"
                                onChange={(e) => formik.setFieldValue(`medications[${index}].name`, e.target.value)}
                                value={medication.name}
                                className="w-[40%] border rounded-md px-2 py-1"
                              />
                              <input
                                type="text"
                                placeholder="Dosage"
                                onChange={(e) => formik.setFieldValue(`medications[${index}].dosage`, e.target.value)}
                                value={medication.dosage}
                                className="w-[20%] border rounded-md px-2 py-1"
                              />
                              <input
                                type="text"
                                placeholder="Frequency"
                                onChange={(e) => formik.setFieldValue(`medications[${index}].frequency`, e.target.value)}
                                value={medication.frequency}
                                className="w-[35%] border rounded-md px-2 py-1"
                              />
                          </div>
                          <div className="space-x-2">
                              <input
                                type="date"
                                placeholder="Date"
                                onChange={(e) => formik.setFieldValue(`medications[${index}].startDate`, e.target.value)}
                                value={medication.startDate}
                                className="w-[40%] border rounded-md px-2 py-1"
                              />
                              <select
                                id="status"
                                name="status"
                                onChange={(e) => formik.setFieldValue(`medications[${index}].status`, e.target.value)}                    
                                value={medication.status}
                                className="border rounded-md px-2 py-1 "
                              >
                                <option value="" label="Select Status" />
                                <option value="Ongoing" label="Ongoing" />
                                <option value="Ended" label="Ended" />
                              </select>
                  
                          </div>
                      </div>
                      
                      {/* More fields for Medications */}
                      <div className="w-[20%] flex">
                        <button className="bg-blue-500 w-full h-[44%] rounded-md text-white font-semibold" type="button" onClick={() => handleRemoveField('medications', index)}>
                          Remove
                        </button>
                      </div>
                      
                    </div>
                  ))}
                  <div className="flex justify-center">
                    <button type="button" onClick={() => handleAddField('medications')} className="m-2 bg-green-500 text-white font-semibold px-4 py-1 text-sm rounded-md">
                      Add Medication
                    </button>
                  </div>
                </div>

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

                {/* Vaccinations */}
                <div className="bg-gray-200 w-full my-4 px-2 rounded-md font-medium py-1">Vaccinations</div>
                <div className="w-full">
                  {formik.values.vaccinations.map((vaccination, index) => (
                    <div key={index} className="flex pl-2 my-3 space-x-2">
                      <div className="w-[5%] flex items-center">{index+1}.</div>
                      <div className="w-[75%]">
                          <div className="space-x-2">
                              <input
                                type="text"
                                placeholder="Name"
                                onChange={(e) => formik.setFieldValue(`vaccinations[${index}].name`, e.target.value)}
                                value={vaccination.name}
                                className="w-[50%] border rounded-md px-2 py-1"
                              />
                              <input
                                type="date"
                                placeholder="Date"
                                onChange={(e) => formik.setFieldValue(`vaccinations[${index}].date`, e.target.value)}
                                value={vaccination.date}
                                className="w-[48%] border rounded-md px-2 py-1"
                              />
                          </div>
                      </div>
                      
                      {/* More fields for Medications */}
                      <div className="w-[20%] flex">
                        <button className="bg-blue-500 w-full rounded-md text-white font-semibold" type="button" onClick={() => handleRemoveField('vaccinations', index)}>
                          Remove
                        </button>
                      </div>
                      
                    </div>
                  ))}
                  <div className="flex justify-center">
                    <button type="button" onClick={() => handleAddField('vaccinations')} className="m-2 bg-green-500 text-white font-semibold px-4 py-1 text-sm rounded-md">
                      Add Vaccinations
                    </button>
                  </div>
                </div>

                {/* Surgeries */}
                <div className="bg-gray-200 w-full my-4 px-2 rounded-md font-medium py-1">Surgeries</div>
                <div className="w-full">
                  {formik.values.surgeries.map((surgery, index) => (
                    <div key={index} className="flex pl-2 my-3 space-x-2">
                      <div className="w-[5%] flex items-center">{index+1}.</div>
                      <div className="w-[75%]">
                          <div className="space-x-2">
                              <input
                                type="text"
                                placeholder="Name"
                                onChange={(e) => formik.setFieldValue(`surgeries[${index}].name`, e.target.value)}
                                value={surgery.name}
                                className="w-[50%] border rounded-md px-2 py-1"
                              />
                              <input
                                type="date"
                                placeholder="Date"
                                onChange={(e) => formik.setFieldValue(`surgeries[${index}].date`, e.target.value)}
                                value={surgery.date}
                                className="w-[48%] border rounded-md px-2 py-1"
                              />
                          </div>
                      </div>
                      
                      {/* More fields for Medications */}
                      <div className="w-[20%] flex">
                        <button className="bg-blue-500 w-full rounded-md text-white font-semibold" type="button" onClick={() => handleRemoveField('surgeries', index)}>
                          Remove
                        </button>
                      </div>
                      
                    </div>
                  ))}
                  <div className="flex justify-center">
                    <button type="button" onClick={() => handleAddField('surgeries')} className="m-2 bg-green-500 text-white font-semibold px-4 py-1 text-sm rounded-md">
                      Add Surgery
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
          </div>
        </div>
      </div>
  );
};

export default MedicalRecord;