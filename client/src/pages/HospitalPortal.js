import React, { useState } from 'react'
import '../styles/RegisterStyles.css'
import HospitalLoginCard from './HospitalLoginCard';
import HospitalRegisterCard from './HospitalRegisterCard';
const HospitalPortal = () => {
    const [isLogin, setLogin] = useState(true); // 'login' or 'register'

    const toggleCard = () => {
      setLogin(!isLogin);
    };

  return (

    <>
        <div className="w-[60%]">
            <img src="hospitalLogin.jpg" alt="" className='w-[100%]' />
        </div>
        <div className="w-[40%] p-8 px-12 bg-gradient-to-r from-blue-700 to-blue-900">
            {isLogin ? <HospitalLoginCard toggleCard={toggleCard} /> : <HospitalRegisterCard toggleCard={toggleCard} />}
        </div>
    </>
  )
}

export default HospitalPortal