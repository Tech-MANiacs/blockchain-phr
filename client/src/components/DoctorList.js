import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LayoutStyles.css";

const DoctorList = ({ doctor }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="shadow-md font-['IBM Plex Sans'] w-56 doctorCard rounded-md m-2"
        style={{ cursor: "pointer" }}

        //on clicking on the card, user should be directed to appointment booking page of that particular doctor's booking page
        onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
      >
        <div className="bg-[#403333] text-lg px-2 py-1 rounded-t-md text-center text-white font-semibold ">
         {doctor.firstName} {doctor.lastName}
        </div>
        <div className="card-body p-2">
          <p className="py-1 flex">
            <div className="font-semibold w-1/2">Specialization</div> 
            <div className="w-1/2">{doctor.specialization}</div>
          </p>
          <p className="py-1 flex">
            <div className="font-semibold w-1/2">Experience</div> 
            <div className="w-1/2">{doctor.experience}</div>
          </p>
          <p className="py-1 flex">
            <div className="font-semibold w-1/2">Timings</div> 
            <div className="w-1/2">{doctor.timings[0]} - {doctor.timings[1]}</div>
          </p>
        </div>
      </div>
    </>
  );
};

export default DoctorList;