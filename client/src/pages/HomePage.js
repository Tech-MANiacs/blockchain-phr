import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from 'formik';
import Layout from "../components/Layout";
import {useSelector} from 'react-redux'
import * as Yup from 'yup';
import MedicalRecord from "./MedicalRecord";
import {contract} from '../web3';
import DoctorSearch from "./DoctorSearch";

const HomePage = () => {
  const {user} = useSelector(state=>state.user)

  const giveAccess = async() =>{
    console.log(user.ethId);
    const tx = await contract.giveAccess(user.ethId);
    console.log(tx);
  }

  const checkMyAccess = async() =>{
    console.log(user.ethId);
    const as = await contract.checkAccess(user.ethId, user.ethId);
    console.log(as);
    // const tx = await contract.giveAscess("0x343Beb5D63dac9eF2892a97d8391eef9fAb6b50F");
  }
  // async function interactWithContract() {
  //   try {
  //     // Replace 'userEthereumAddress' with the actual Ethereum address from the user's database
  
  //     // const contract = await connectToMetamaskWithAddress(user.ethId);
      
  //     // Continue with contract interactions using the signer
      
  //     // Example interaction: Call a function on the contract
  //     const result = await contract.CheckAccess(user.ethId, "0x5e1fFaD9B5C095e8607e023d9ccEC42AeF570836");

  //     console.log("Contract result:", result);
  
  //     // Example interaction: Send a transaction to the contract
  //     const tx = await contract.giveAccess("0x5e1fFaD9B5C095e8607e023d9ccEC42AeF570836");
  //     await tx.wait();
  //     console.log("Transaction completed");
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // }

  const getUserData = async () => {
    // try {
    //   const res = await axios.get(
    //     "/api/v1/user/getAllDoctors",

    //     {
    //       headers: {
    //         Authorization: "Bearer " + localStorage.getItem("token"),
    //       },
    //     }
    //   );
    //   if (res.data.success) {
    //     setDoctors(res.data.data);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <Layout>
      {
          user && user.isUser === true && user.phrId === null ? (
            <>
              {/* Components or content for the true condition */}
              <MedicalRecord />
              {/* Add more components or content here */}
            </>
          ) : (
            <>
              <div className="flex space-x-4">
              {/* Components or content for the false condition */}
                <div className=" overflow-y-scroll w-[60%] rounded-xl bg-white shadow-sm">
                  <DoctorSearch />
                </div>
                <div className="h-[50vh] w-[40%] rounded-xl bg-white shadow-sm">
                  <div className="mt-2 mx-2 bg-blue-600 rounded-full cursor-pointer w-fit text-white font-semibold px-2 py-1" onClick={giveAccess}>Give Access</div>
                  <div className="mt-2 mx-2 bg-blue-600 rounded-full cursor-pointer w-fit text-white font-semibold px-2 py-1" onClick={checkMyAccess}>Check My Access</div>
                  <div className="mt-2 mx-2 bg-blue-600 rounded-full cursor-pointer w-fit text-white font-semibold px-2 py-1" onClick={() => console.log(user.ethId)}>What is my Eth Id</div>
                </div>
              </div>
              {/* Add more components or content here */}
            </>
          )
        // <div className="font-semibold">
        //   <div className="bg-blue-500 rounded-md px-2 py-1 text-lg text-white font-semibold cursor-pointer" onClick={doSomething}>CONNECT</div>
        // </div>
      }
      
      
    </Layout>
  );
};

export default HomePage;