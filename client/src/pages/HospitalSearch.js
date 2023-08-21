import React, { useEffect, useState } from "react";
import axios from "axios";

const HospitalSearch = ({setCurrentHospital, setOpen}) => {

  const [searchText, setSearchText] = useState('');
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get(`/api/v1/hospital/gethospitals?name=${searchText}`);
        setHospitals(response.data);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      }
    };

    if (searchText) {
      fetchHospitals();
    } else {
      setHospitals([]);
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
        {hospitals.length > 0 && (
          <div className="absolute z-10 mt-2 w-full bg-white border rounded-md shadow-lg">
            <ul>
              {hospitals.map((hospital) => (
                <li 
                    key={hospital._id} 
                    className="cursor-pointer hover:bg-gray-50 mb-2 p-2 border-b-2"  
                    onClick={() => {
                        console.log("Selected hospital:", hospital); // Log the selected hospital
                        setCurrentHospital(hospital);
                        setHospitals([]);
                        setOpen(true);
                      }}
                >
                    <strong className="pl-4">{hospital.name}</strong><br />
                    <div className="mt-2 text-sm">
                        <div className="flex font-semibold text-blue-700">
                            <div className="w-1/2 pl-4">Mobile</div>
                            <div className="w-1/2 pl-4">City</div>
                        </div>
                        <div className="flex font-medium">
                            <div className="w-1/2 pl-4">{hospital.mobile}</div>
                            <div className="w-1/2 pl-4">{hospital.city}</div>
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

export default HospitalSearch;