import React from "react";
import {contract} from '../web3';

const GiveAccess = ({doctor, setOpen}) => {

  const giveAccess = async(doctor) =>{
    console.log(doctor.ethId);
    const tx = await contract.giveAccess(doctor.ethId);
    console.log(tx);
  }

  const revokeAccess = async(doctor) =>{
    console.log(doctor.ethId);
    const tx = await contract.revokeAccess(doctor.ethId);
    console.log(tx);
  }

  console.log(doctor);

  return (
    
    <div className="my-2 p-2">
        <strong className="pl-4">{"Dr. "} {doctor.firstName} {doctor.lastName}</strong><br />
        <div className="mt-2 text-sm">
            <div className="flex font-semibold text-blue-700">
                <div className="w-1/3 pl-4">Mobile</div>
                <div className="w-1/3 pl-4">Email</div>
                <div className="w-1/3 pl-4">Specialization</div>
            </div>
            <div className="flex font-medium">
                <div className="w-1/3 pl-4">{doctor.mobile}</div>
                <div className="w-1/3 pl-4">{doctor.email}</div>
                <div className="w-1/3 pl-4">{doctor.specialization}</div>
            </div>
        </div>
        <div className="mt-2 text-sm">
            <div className="flex font-semibold text-blue-700">
                <div className="w-1/3 pl-4">Experience</div>
                <div className="w-1/3 pl-4">City</div>
                <div className="w-1/3 pl-4">Address</div>
            </div>
            <div className="flex font-medium">
                <div className="w-1/3 pl-4">{doctor.experience} {"Years"}</div>
                <div className="w-1/3 pl-4">{doctor.city}</div>
                <div className="w-1/3 pl-4">{doctor.address}</div>
            </div>
        </div>
        <div className="flex justify-end space-x-2 text-sm mt-4 font-semibold">
            <div className="px-3 py-1 bg-blue-500 rounded-md text-white cursor-pointer hover:bg-blue-600" onClick={() => revokeAccess(doctor)}>Revoke Access</div>
            <div className="px-3 py-1 bg-blue-500 rounded-md text-white cursor-pointer hover:bg-blue-600" onClick={() => giveAccess(doctor)}>Grant Access</div>
            <div className="px-3 py-1 bg-blue-500 rounded-md text-white cursor-pointer hover:bg-blue-600" onClick={() => setOpen(false)}>Close</div>
        </div>
        
    </div>
                
  );
};

export default GiveAccess;