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
  console.log(user);
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
      <div className="flex space-x-4">
        <div className="h-fit w-[40%] rounded-xl bg-white shadow-sm p-3">
          <div className="flex justify-center"><img src="profile.png" alt="" className="w-[40%]"/></div>
          <h2 className="text-2xl font-bold my-4 justify-center text-center">{user.name}</h2>
          <UserDetail heading={"E-Mail ID"} text={user.email} />
          <UserDetail heading={"Mobile Number"} text={user.mobile} />
          <UserDetail heading={"ABHA ID"} text={user.abhaId.substring(0,3) + "XXXXX"} />
          <UserDetail heading={"Ethereum Address"} text={user.ethId.substring(0,3) + "XXXXX"} />
        </div>
        <div className="h-fit w-[60%] rounded-xl bg-white shadow-sm p-3">
          <h2 className="text-xl pb-2 px-2 font-semibold">Personal Details</h2>
          <UserDetail heading={"Date of Birth"} text={user.email} />
          <UserDetail heading={"Gender"} text={user.mobile} />
          <UserDetail heading={"Address"} text={user.abhaId.substring(0,3) + "XXXXX"} />
        </div>
      </div>
      
    </Layout>
  );
};

const UserDetail = ({heading, text}) => {
  return (
      <div className="w-full flex">
          <div className="flex w-2/5 items-center font-medium p-2 text-blue-400">{heading}</div>
          <div className={`w-3/5 p-2`}>{text}</div>
      </div>
  );
};

export default UserProfile;