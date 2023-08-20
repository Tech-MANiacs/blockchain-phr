import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from 'formik';
import Layout from "../components/Layout";
import {useSelector} from 'react-redux'
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {showLoading,hideLoading} from '../redux/features/alertSlice';
import { message } from 'antd';

const DoctorSearch = () => {
  const dispatch = useDispatch();
  const {user} = useSelector(state=>state.user)

  const [searchText, setSearchText] = useState('');
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`/api/v1/doctor/getdoctors?firstName=${searchText}`);
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    if (searchText) {
      fetchDoctors();
    } else {
      setDoctors([]);
    }
  }, [searchText]);

  return (
    <div className="p-4">
        <input
            type="text"
            placeholder="Search by first name..."
            className="px-4 py-2 rounded-md border focus:outline-none focus:border-blue-500"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
        />

        <div className="mt-4">
            {doctors.length === 0 ? (
            <p>No doctors found.</p>
            ) : (
            <ul>
                {doctors.map((doctor) => (
                <li key={doctor._id} className="mb-2 p-2 border-b-2">
                    <strong className="pl-4">{doctor.firstName} {doctor.lastName}</strong><br />
                    <div className="mt-2 text-sm">
                        <div className="flex font-semibold text-blue-700">
                            <div className="w-1/2 pl-4">Mobile</div>
                            <div className="w-1/2 pl-4">Specialization</div>
                        </div>
                        <div className="flex font-medium">
                            <div className="w-1/2 pl-4">{doctor.mobile}</div>
                            <div className="w-1/2 pl-4">{doctor.specialization}</div>
                        </div>
                    </div>
                    {/* <div className="mt-2 text-sm">
                        <div className="flex font-semibold text-blue-700">
                            <div className="w-1/2 pl-4">Specialization</div>
                            <div className="w-1/2 pl-4">Experience</div>
                        </div>
                        <div className="flex font-medium">
                            <div className="w-1/2 pl-4">{doctor.specialization}</div>
                            <div className="w-1/2 pl-4">{doctor.experience + " Years"}</div>
                        </div>
                    </div>
                    <div className="mt-2 text-sm">
                        <div className="flex font-semibold text-blue-700">
                            <div className="w-1/2 pl-4">City</div>
                            <div className="w-1/2 pl-4">Address</div>
                        </div>
                        <div className="flex font-medium">
                            <div className="w-1/2 pl-4">{doctor.city}</div>
                            <div className="w-1/2 pl-4">{doctor.address}</div>
                        </div>
                    </div> */}
                </li>
                ))}
            </ul>
            )}
        </div>
    </div>
  );
};

export default DoctorSearch;