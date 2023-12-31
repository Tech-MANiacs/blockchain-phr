import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorSearch = ({setCurrentDoctor, setOpen}) => {

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
      <div className="relative">
        <input
          type="text"
          placeholder="Search by first name..."
          className="px-4 py-2 w-full rounded-full border focus:outline-none focus:border-blue-500"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {/* Add overlay with search results */}
        {doctors.length > 0 && (
          <div className="absolute z-10 mt-2 w-full bg-white border rounded-md shadow-lg">
            <ul>
              {doctors.map((doctor) => (
                <li 
                    key={doctor._id} 
                    className="cursor-pointer hover:bg-gray-50 mb-2 p-2 border-b-2"  
                    onClick={() => {
                        console.log("Selected doctor:", doctor); // Log the selected doctor
                        setCurrentDoctor(doctor);
                        setDoctors([]);
                        setOpen(true);
                      }}
                >
                    <strong className="pl-4">{"Dr. "} {doctor.firstName} {doctor.lastName}</strong><br />
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
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSearch;