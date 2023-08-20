import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import { setUser } from '../redux/features/userSlice';

//children is a prop
export default function ProtectedRoute({children}) {

    const dispatch = useDispatch();

    //getting user from the redux i.e the initial state of the user
    const {user} = useSelector(state => state.user);

    const getUser = async() =>{
        try {
            dispatch(showLoading());
            console.log("helu");
            //verifying token
            const res = await axios.post('/api/v1/user/getUserData', {token:localStorage.getItem('token')},
            {
                headers: {
                    Authorization: `bearer ${localStorage.getItem('token')}`
                }
            })

            dispatch(hideLoading());

            if(res.data.success){
                console.log(res.data.data);
                //we passed user info in the authController function in userCtrl file, we are fetching that data and updating the state of user here
                
                dispatch(setUser(res.data.data));
            }else{
                <Navigate to='/newlanding'/>
                localStorage.clear();
            }

        } catch (error) {
            dispatch(hideLoading());
            localStorage.clear();
            console.log(error)
        }
    }

    useEffect(() => {
        if(!user){
            getUser();
        }
    }, [user, getUser])

    if(localStorage.getItem("token")){
        return children;
    }else{
        return <Navigate to='/'/>;
    }

}

//wrap protected routes in app.js with <ProtectedRoute>