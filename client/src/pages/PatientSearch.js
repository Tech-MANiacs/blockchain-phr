import React, { useState } from "react";
import axios from "axios";

const PatientSearch = ({showPHR, setCurrentPatient}) => {

  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState(null);


    const handleSearch = async () => {
      try {
        const response = await axios.get(`/api/v1/user/getuser`, {
            params: {
            abhaId: searchText
            }
        });
        setSearchResult(response.data);
        console.log("dataa", response.data);
        setCurrentPatient(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const handleClear = () => {
        setSearchText("");
        setSearchResult(null);
      };

  return (
    <div className="p-4">
      <div className="relative">
        <div className="flex space-x-2 border-b-2 pb-4">
            <input
                type="text"
                placeholder="Search by abhaId..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-3/5 border rounded-md px-2"
            />
            <button onClick={handleSearch} className="w-1/5 bg-blue-500 rounded-md font-medium text-white py-1">Search</button>
            <button onClick={handleClear} className="w-1/5 bg-blue-500 rounded-md font-medium text-white py-1">Clear</button>
        </div>
        

        <ul className="mt-4">
            {
                searchResult !== null ? (
                    <>
                        <li className="font-semibold flex">
                            <div className="w-3/4">{searchResult.name}</div>
                            <button onClick={() => showPHR()} className="w-1/4 bg-blue-500 rounded-md font-medium text-white py-1">Show PHR</button>
                        </li>
                    </>
                ) : (
                    <>
                    </>
                )
            }
        </ul>
      </div>
    </div>
  );
};

export default PatientSearch;