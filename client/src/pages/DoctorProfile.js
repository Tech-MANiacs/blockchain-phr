import React from "react";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";
const DoctorProfile = () => {
  const { user } = useSelector((state) => state.user);
  console.log(user);
  return (
    <Layout>
      <div className="flex space-x-4">
        <div className="h-fit w-[40%] rounded-xl bg-white shadow-sm p-3">
          <div className="flex justify-center"><img src="profile.png" alt="" className="w-[40%]"/></div>
          <h2 className="text-2xl font-bold my-4 justify-center text-center">{user.firstName + " " + user.lastName}</h2>
          <UserDetail heading={"E-Mail ID"} text={user.email} />
          <UserDetail heading={"Mobile Number"} text={user.mobile} />
          <UserDetail heading={"HCP ID"} text={user.doctorId.substring(0,3) + "XXXXX"} />
          <UserDetail heading={"Ethereum Address"} text={user.ethId.substring(0,3) + "XXXXX"} />
        </div>
        <div className="h-fit w-[60%] rounded-xl bg-white shadow-sm p-3">
          <h2 className="text-xl pb-2 px-2 font-semibold">Personal Details</h2>
          <UserDetail heading={"City"} text={user.city} />
          <UserDetail heading={"Address"} text={user.address} />
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

export default DoctorProfile;