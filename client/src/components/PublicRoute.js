import React from 'react'
import { Navigate } from 'react-router-dom'

export default function PublicRoute({children}) {
  if(localStorage.getItem('token')){
    return <Navigate to='/'/>;
  }else{
    return children;
  }
}

//wrap public routes in app.js with <PublicRoute>