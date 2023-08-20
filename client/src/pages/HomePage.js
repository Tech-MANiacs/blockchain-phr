import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from 'formik';
import Layout from "../components/Layout";
import {useSelector} from 'react-redux'
import * as Yup from 'yup';
import MedicalRecord from "./MedicalRecord";
import {contract} from '../web3';

const HomePage = () => {
  const {user} = useSelector(state=>state.user)

  const doSomething = async() =>{
    const as = await contract.CheckAscess("0x82cEBa1FF70BcC327c44BF0ecf1e2201cFe10945", "0x343Beb5D63dac9eF2892a97d8391eef9fAb6b50F");
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
        user && user.isUser === true && user.phrId === null ? <MedicalRecord /> : 
        <div className="font-semibold">
          <div className="bg-blue-500 rounded-md px-2 py-1 text-lg text-white font-semibold cursor-pointer" onClick={doSomething}>CONNECT</div>
        </div>
      }
      
      
    </Layout>
  );
};

export default HomePage;