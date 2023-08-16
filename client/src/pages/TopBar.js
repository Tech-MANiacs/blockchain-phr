import React from 'react'

const TopBar = ({isSignUpMode}) => {
  return (
    
    <div className="fixed top-0 left-0 w-full p-4 z-[100]"> 
        <div className="flex w-full items-center">
        <div className="w-1/2 flex">
            <img src="newlogo.png" className="w-[55px]" />
            <div className={`${isSignUpMode ? "" : "text-white"} transition-colors delay-500 ml-2 logotext font-semibold text-5xl`}>SOLVE MY DOUBT</div>
        </div>
        <div className={`w-1/2 flex justify-end ${isSignUpMode ? "text-white" : ""} transition-colors delay-500`}>
            <div className="pl-16 text-lg font-semibold">HOME</div>
            <div className="pl-16 text-lg font-semibold">ABOUT</div>
            <div className="pl-16 pr-12 text-lg font-semibold">CONTACT US</div>
        </div>
        </div>
    </div>
  )
}

export default TopBar