import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Form, Input, Row, TimePicker, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import moment from "moment";

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  // update doctor ==========
  //handle form

  //getDOc Details
//   const getUserInfo = async () => {
//     try {
//         //as ID is there in the url, we fetched the user ID from the url using params hook
//       const res = await axios.post(
//         "/api/v1/doctor/getDoctorInfo",
//         { userId: params.id },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       if (res.data.success) {
//         setDoctor(res.data.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getDoctorInfo();
//     //eslint-disable-next-line
//   }, []);
  return (
    <Layout>
      <div className="bg-blue-500 text-white font-semibold text-lg rounded-md text-center py-1">Profile</div>
      {user && (
        <div className="text-lg"> {user.name}</div>
      )}
    </Layout>
  );
};

export default UserProfile;