import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from 'formik';
import Layout from "../components/Layout";
import {useSelector} from 'react-redux'
import * as Yup from 'yup';
import MedicalRecord from "./MedicalRecord";
import {contract} from '../web3';
import DoctorSearch from "./DoctorSearch";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GiveAccess from "./GiveAccess";

const AccessManagement = () => {
  const {user} = useSelector(state=>state.user)

  const [doctorsWithAccess, setDoctorsWithAccess] = useState([]);
  const [peopleWithAccess, setPeopleWithAccess] = useState([]);

  const revokeAccess = async(User) =>{
    console.log(User.ethId);
    const tx = await contract.revokeAccess(User.ethId);
    console.log(tx);
  }

  const checkPeopleAccess = async(User) =>{
    console.log(User.ethId);
    return await contract.checkAccess(user.ethId, User.ethId);
  }

  const checkDoctorsWithAccess = async() =>{
    try {
        const res = await axios.get(`/api/v1/user/getDoctorsWithAccess`);
        const doctors = res.data.doctors;
        console.log("Doctors", doctors);
        const doctorsWithAccess = [];

        for (const doctor of doctors) {
          const hasAccess = await checkPeopleAccess(doctor);
          if (hasAccess) {
            doctor.isDoctor = res.data.isDoctor;
            doctor.isHospital = res.data.isHospital;
            doctorsWithAccess.push(doctor);
          }
        }
        console.log("doswa", doctorsWithAccess);
        setPeopleWithAccess(prevPeople => [...prevPeople, ...doctorsWithAccess]);

      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    const checkHospitalsWithAccess = async() =>{
      try {
          const res = await axios.get(`/api/v1/user/getHospitalsWithAccess`);
          // console.log(res);
          const hospitals = res.data.hospitals;
          const hospitalsWithAccess = [];
  
          for (const hospital of hospitals) {
            const hasAccess = await checkPeopleAccess(hospital);
            if (hasAccess) {
              hospital.isDoctor = res.data.isDoctor;
              hospital.isHospital = res.data.isHospital;
              hospitalsWithAccess.push(hospital);
            }
          }
          console.log("hoswa", hospitalsWithAccess);
          const people = peopleWithAccess.concat(hospitalsWithAccess);
          setPeopleWithAccess(prevPeople => [...prevPeople, ...people]);
        } catch (error) {
          console.error('Error fetching hospitals:', error);
        }
      };

    useEffect(() => {
      // Call the function when the component mounts (window loads)
      checkDoctorsWithAccess();
      checkHospitalsWithAccess();
    }, []);

  return (
    <Layout>

                
                <div className="h-fit w-full rounded-xl bg-white shadow-sm">
                  <div className="mt-2 mx-2 font-semibold px-2 pt-2 pb-2 border-b-2 text-gray-500">PHR Access</div>
                  <div className="mt-2 mx-2 font-semibold px-2 pt-1 pb-2">
                    {peopleWithAccess.length === 0 ? (
                      <p>You have not given PHR access to anyone</p>
                    ) : (
                      <ul>
                        
                        {Array.from(new Set(peopleWithAccess.map(item => item._id)))
  .map(_id => peopleWithAccess.find(item => item._id === _id)).map((people) => (
                            <li key={people._id} className="border-b-2 mt-2 pb-2">
                            {
                                people.isDoctor ? (
                                  <>
                                      <div>{"Dr. "} {people.firstName} {people.lastName}</div>
                                      <div className="flex mt-2 text-blue-400">
                                        <div className="w-1/3 ">Doctor ID</div>
                                        <div className="w-1/3">Mobile</div>
                                        <div className="w-1/3">Email</div>
                                      </div>
                                      <div className="flex">
                                        <div className="w-1/3">{people.doctorId}</div>
                                        <div className="w-1/3">{people.mobile}</div>
                                        <div className="w-1/3 mb-2">{people.email}</div>
                                      </div>
                                      <div className="flex mt-2 text-blue-400">
                                        <div className="w-1/3 ">Experience</div>
                                        <div className="w-1/3">Specialization</div>
                                        <div className="w-1/3">City</div>
                                      </div>
                                      <div className="flex">
                                        <div className="w-1/3">{people.experience} {"Years"}</div>
                                        <div className="w-1/3">{people.specialization}</div>
                                        <div className="w-1/3 mb-2">{people.city}</div>
                                      </div>
                                  </>
                                ) : (
                                  <>
                                    <strong>{people.name}</strong><br />
                                      <div className="flex mt-2 text-blue-400">
                                        <div className="w-1/3 ">Hospital ID</div>
                                        <div className="w-1/3">Mobile</div>
                                        <div className="w-1/3">Email</div>
                                      </div>
                                      <div className="flex">
                                        <div className="w-1/3">{people.hospitalId}</div>
                                        <div className="w-1/3">{people.mobile}</div>
                                        <div className="w-1/3 mb-2">{people.email}</div>
                                      </div>
                                      <div className="flex mt-2 text-blue-400">
                                        <div className="w-1/3 ">Pin Code</div>
                                        <div className="w-1/3">City</div>
                                        
                                      </div>
                                      <div className="flex">
                                        <div className="w-1/3">{people.pinCode}</div>
                                        <div className="w-1/3">{people.city}</div>
                                      </div>
                                  </>
                                )
                              }
                            <div className="flex justify-end space-x-2 text-sm mt-2 font-semibold">
                                <div className="px-3 py-1 bg-blue-500 rounded-md text-white cursor-pointer hover:bg-blue-600" onClick={() => revokeAccess(people)}>Revoke Access</div> 
                            </div>
                            </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                </div>
              
    </Layout>
  );
};

export default AccessManagement;