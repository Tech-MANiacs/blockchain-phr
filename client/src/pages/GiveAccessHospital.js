import React from "react";
import {contract} from '../web3';

const GiveAccessHospital = ({hospital, setOpen}) => {

  const giveAccess = async(hospital) =>{
    console.log(hospital.ethId);
    const tx = await contract.giveAccess(hospital.ethId);
    console.log(tx);
  }

  const revokeAccess = async(hospital) =>{
    console.log(hospital.ethId);
    const tx = await contract.revokeAccess(hospital.ethId);
    console.log(tx);
  }

  console.log(hospital);

  return (
    
    <div className="my-2 p-2">
        <strong className="pl-4">{hospital.name}</strong><br />
        <div className="mt-2 text-sm">
            <div className="flex font-semibold text-blue-700">
                <div className="w-1/3 pl-4">Hospital ID</div>
                <div className="w-1/3 pl-4">Email</div>
                <div className="w-1/3 pl-4">Mobile</div>
            </div>
            <div className="flex font-medium">
                <div className="w-1/3 pl-4">{hospital.hospitalId}</div>
                <div className="w-1/3 pl-4">{hospital.email}</div>
                <div className="w-1/3 pl-4">{hospital.mobile}</div>
            </div>
        </div>
        <div className="mt-2 text-sm">
            <div className="flex font-semibold text-blue-700">
                <div className="w-1/3 pl-4">PinCode</div>
                <div className="w-1/3 pl-4">City</div>
            </div>
            <div className="flex font-medium">
                <div className="w-1/3 pl-4">{hospital.pinCode}</div>
                <div className="w-1/3 pl-4">{hospital.city}</div>
            </div>
        </div>
        <div className="flex justify-end space-x-2 text-sm mt-4 font-semibold">
            <div className="px-3 py-1 bg-blue-500 rounded-md text-white cursor-pointer hover:bg-blue-600" onClick={() => revokeAccess(hospital)}>Revoke Access</div>
            <div className="px-3 py-1 bg-blue-500 rounded-md text-white cursor-pointer hover:bg-blue-600" onClick={() => giveAccess(hospital)}>Grant Access</div>
            <div className="px-3 py-1 bg-blue-500 rounded-md text-white cursor-pointer hover:bg-blue-600" onClick={() => setOpen(false)}>Close</div>
        </div>
        
    </div>
                
  );
};

export default GiveAccessHospital;