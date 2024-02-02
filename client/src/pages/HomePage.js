import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import {useSelector} from 'react-redux'
import MedicalRecord from "./MedicalRecord";
import {contract} from '../web3';
import DoctorSearch from "./DoctorSearch";
import { Link } from "react-router-dom";
import GiveAccess from "./GiveAccess";
import HospitalSearch from "./HospitalSearch";
import {useDispatch} from 'react-redux';
import {hideLoading} from '../redux/features/alertSlice';
import GiveAccessHospital from "./GiveAccessHospital";
import PatientSearch from "./PatientSearch";
import { message } from 'antd';
import ViewPHR from "./ViewPHR";
import AddRecordUser from "./AddRecordUser";

const HomePage = () => {
  const dispatch = useDispatch();
  const {user} = useSelector(state=>state.user);
  
  const [selectedTab, setSelectedTab] = useState('doctors');
  const [peopleWithAccess, setPeopleWithAccess] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState({});
  const [currentHospital, setCurrentHospital] = useState({});
  const [currentPatient, setCurrentPatient] = useState({});
  const [showTab, setShowTab] = useState(false);
  const [phr, setPHR] = useState([]);
  const [addRecord, setAddRecord] = useState(false);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const checkPeopleAccess = async(User) =>{
    console.log(User.ethId);
    return await contract.checkAccess(user.ethId, User.ethId);
  }

  const showPHR = async() =>{
    try {

        const isAccess = await contract.checkAccess(currentPatient.ethId, user.ethId);
        if(!isAccess){
          message.error("You do not have access to view this PHR!");
          setShowTab(false);
        }

        else{
            try {
                const result = await axios.get('/api/v1/user/fetchphr', {
                    params: {
                      ethId: currentPatient.ethId,
                      isUser: false
                    }
                });

                if(result.data.success === false){
                    message.error(result.data.message);
                }
                message.success("yay");
                setPHR( result.data.phr);
                console.log("PHR", result.data.phr);
                setShowTab(true);
                console.log(showTab);
                
          } catch (error) {
              dispatch(hideLoading());
              console.log(error);
              message.error("Something went wrong)");
          }
        }

      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

  const checkDoctorsWithAccess = async() =>{
    try {
        const res = await axios.get(`/api/v1/user/getDoctorsWithAccess`);
        const doctors = res.data.doctors;
        console.log("Doctors", doctors);
        const doctorsWithAccess = [];

        for (const doctor of doctors) {
          const hasAccess = await checkPeopleAccess(doctor);
          console.log(hasAccess);
          if (hasAccess) {
            doctor.isDoctor = res.data.isDoctor;
            doctor.isHospital = res.data.isHospital;
            doctorsWithAccess.push(doctor);
          }
        }
        console.log("doswa", doctorsWithAccess);
        const people = peopleWithAccess.concat(doctorsWithAccess);
        setPeopleWithAccess(prevPeople => [...prevPeople, ...people]);

      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    const checkHospitalsWithAccess = async() =>{
      try {
          const res = await axios.get(`/api/v1/user/getHospitalsWithAccess`);
          // console.log(res);
          const hospitals = res.data.hospitals;
          const hospitalsWithAccess = [];
  
          for (const hospital of hospitals) {
            const hasAccess = await checkPeopleAccess(hospital);
            if (hasAccess) {
              hospital.isDoctor = res.data.isDoctor;
              hospital.isHospital = res.data.isHospital;
              hospitalsWithAccess.push(hospital);
            }
          }
          console.log("hoswa", hospitalsWithAccess);
          const people = peopleWithAccess.concat(hospitalsWithAccess);
          setPeopleWithAccess(prevPeople => [...prevPeople, ...people]);
        } catch (error) {
          console.error('Error fetching hospitals:', error);
        }
      };

    useEffect(() => {
      // Call the function when the component mounts (window loads)
      checkDoctorsWithAccess();
    }, []);
    useEffect(() => {
      // Call the function when the component mounts (window loads);
      checkHospitalsWithAccess();
    }, []);
    console.log("peopleWithAccess after useEffect:", peopleWithAccess);
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
                {
                  user && user.isUser ? (
                    <>
                      <div className="w-[60%]">
                        <div className="h-fit rounded-xl bg-white shadow-sm">
                          <div className="flex mx-4 pt-4 space-x-6 font-semibold">
                            <div
                              className={`pb-2 cursor-pointer ${selectedTab === 'doctors' ? 'text-blue-600 border-blue-600 border-b-2' : 'text-gray-500'}`}
                              onClick={() => handleTabChange('doctors')}
                            >
                              Doctors
                            </div>
                            <div
                              className={`pb-2 cursor-pointer ${selectedTab === 'hospitals' ? 'text-blue-600 border-blue-600 border-b-2' : 'text-gray-500'}`}
                              onClick={() => handleTabChange('hospitals')}
                            >
                              Hospitals
                            </div>    
                          </div>

                          {selectedTab === 'doctors' ? (
                            <DoctorSearch setCurrentDoctor = {setCurrentDoctor} setOpen = {setOpen} />
                          ) : (
                            <HospitalSearch setCurrentHospital = {setCurrentHospital} setOpen = {setOpen} />
                          )}
                        </div>
                        <div className="h-fit rounded-xl bg-white shadow-sm">
                          {selectedTab === 'doctors' ? (
                              <>
                              {isOpen && <GiveAccess doctor={currentDoctor} setOpen={setOpen} />}
                              </>
                            ) : (
                              <>
                              {isOpen && <GiveAccessHospital hospital={currentHospital} setOpen={setOpen} />}
                              </>
                            )
                          }
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                        <div className="w-[40%]">
                        <div className="h-fit rounded-xl bg-white shadow-sm">
                        { user && 
                        <>
                            { 
                              user.isDoctor ? (
                                <>
                                  <div className="flex text-lg mx-4 py-4 space-x-6 font-semibold">                                                                  
                                    {"Dr."}  {user.firstName} {user.lastName}                  
                                  </div>
                                  <div className="flex mx-4">
                                      <div className="w-1/2 font-semibold text-blue-500">Specialization</div>
                                      <div className="w-1/2 font-semibold">{user.specialization}</div>
                                  </div>
                                  <div className="flex mx-4 mb-4 pb-4">
                                      <div className="w-1/2 font-semibold text-blue-500">Experience</div>
                                      <div className="w-1/2 font-semibold">{user.experience} {"Years"}</div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex text-lg mx-4 py-4 space-x-6 font-semibold">                                                                  
                                    {user.name}                  
                                  </div>
                                  <div className="flex mx-4">
                                      <div className="w-1/2 font-semibold text-blue-500">City</div>
                                      <div className="w-1/2 font-semibold">{user.city}</div>
                                  </div>
                                  <div className="flex mx-4 mb-4 pb-4">
                                      <div className="w-1/2 font-semibold text-blue-500">Email</div>
                                      <div className="w-1/2 font-semibold">{user.email}</div>
                                  </div>
                                </>
                              )
                              
                            }
                          
                          </>
                        }
                                               
                        </div>
                      </div>
                    </>
                  )
                }
                
                
                {
                  user && user.isUser ? (
                    <>
                      <div className="h-fit w-[40%] rounded-xl bg-white shadow-sm">
                        <div className="mt-2 mx-2 font-semibold px-2 pt-1 pb-2 border-b-2 text-gray-500">PHR Access</div>
                        <div className="mt-2 mx-2 font-semibold px-2 pt-1 pb-2">
                          {peopleWithAccess.length === 0 ? (
                            <p>You have not given PHR access to anyone</p>
                          ) : (
                            <ul>
                              {Array.from(new Set(peopleWithAccess.map(item => item._id)))
        .map(_id => peopleWithAccess.find(item => item._id === _id)).slice(0,2).map((people) => (
                                <Link to="/accessManagement">
                                  <li key={people._id} className="text-sm border-b-2 mt-2">
                                    {
                                      people.isDoctor ? (
                                        <>
                                            <div>{"Dr. "} {people.firstName} {people.lastName}</div>
                                            <div className="flex mt-2">
                                              <div className="w-1/2 text-blue-400">Mobile</div>
                                              <div className="w-1/2">{people.mobile}</div>
                                            </div>
                                            <div className="flex">
                                              <div className="w-1/2 text-blue-400">Specialization</div>
                                              <div className="w-1/2 mb-2">{people.specialization}</div>
                                            </div>
                                        </>
                                      ) : (
                                        <>
                                          <strong>{people.name}</strong><br />
                                            <div className="flex mt-2">
                                              <div className="w-1/2 text-blue-400">Mobile</div>
                                              <div className="w-1/2">{people.mobile}</div>
                                            </div>
                                            <div className="flex">
                                              <div className="w-1/2 text-blue-400">City</div>
                                              <div className="w-1/2 mb-2">{people.city}</div>
                                            </div>
                                        </>
                                      )
                                    }
                                  
                        
                                  </li>
                                </Link>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="flex justify-end mx-2 mb-1 font-semibold px-2 pt-1 pb-2">
                          <Link to="/accessManagement">
                            {
                              peopleWithAccess.length > 0 && <div className="w-fit rounded-full cursor-pointer px-2 py-1 hover:bg-blue-600 bg-blue-500 text-sm text-white">View More</div>
                            }
                            
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-[60%]">
                        <div className="h-fit rounded-xl bg-white shadow-sm">
                          <div className="flex mx-4 pt-4 space-x-6 font-semibold pb-2">
                            Search Patients by ABHA ID
                        
                          </div>
                            <PatientSearch showPHR = {showPHR} setCurrentPatient = {setCurrentPatient}/>                        
                        </div>
                      </div>
                    </>
                  )
                }
                
              </div>

              {user && user.isUser === false && addRecord ? (
                <div className="w-[100%] h-fit rounded-xl my-4 bg-white shadow-sm">
                    <AddRecordUser currentPatient = {currentPatient} doctor = {user} phrID = {phr._id}/>
                </div>
              ) : (
                <>
                </>
              )}

              {user && user.isUser === false && showTab ? (
                <div className="w-[100%] mt-4 flex justify-end ">
                  <div className="px-2 py-1 bg-blue-500 cursor-pointer rounded-t-xl text-white font-semibold" onClick={() => setAddRecord(true)}>
                      Add a record
                  </div>
                </div>
              ) : (
                <>
                </>
              )}

              {user && user.isUser === false && showTab ? (
                <div className="w-[100%] h-fit rounded-b-xl rounded-tl-xl bg-white shadow-sm">
                  <div className="px-4">
                    <div className="text-lg font-bold py-2 border-b-2">{currentPatient && currentPatient.name}</div>
                    <ViewPHR phr = {phr}/>
                  </div>
                </div>
              ) : (
                <>
                </>
              )}

              
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