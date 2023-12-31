import React from "react";
import "../styles/LayoutStyles.css";
import { adminMenu, userMenu } from "../Data/data";
import {useSelector, useDispatch} from 'react-redux';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import { setUser } from '../redux/features/userSlice';
const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // logout funtion
  const handleLogout = () => {
    localStorage.clear();
    dispatch(setUser(null));
    message.success("Logout Successfully");
    navigate("/");
  };

  // =========== doctor menu ===============
  const doctorMenu = [
    {
      name: "Home",
      path: "/dashboard",
      icon: "fa-solid fa-house",
    },

    {
        //path is here dynamic
      name: "Profile",
      path: `/doctorprofile`,
      icon: "fa-solid fa-user",
    },
  ];
  // =========== doctor menu ===============

  // redering menu list

  //if user is admin show admin sidebar else if user if doctor then show doctor sidebar else show user sidebar
  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;
  return (
    <>
      <div className="main">
        <div className="layout">
          <div className="sidebar">
            <div className="logo flex items-center justify-center h-[8vh] mb-8">

            <img src="health.png" alt="health" className='h-[70%] cursor-pointer mr-4' />
            <div className='font-["Poppins"] text-white font-bold text-2xl cursor-pointer'>MEDICHAIN</div>
            </div>
            <div className="flex justify-center">
              <div className="menu w-[90%]">
                {SidebarMenu.map((menu) => {
                  const isActive = location.pathname === menu.path;
                  return (
                    <>
                      <Link to={menu.path}>
                        <div className={`menu-item ${isActive && "active"}`}>
                          <i className={menu.icon}></i>
                          {menu.name}
                        </div>
                      </Link>
                    </>
                  );
                })}
                  <div className={`menu-item `} onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Logout
                  </div>
              </div>
            </div>
            
          </div>
          <div className="content">
            <div className="header items-center flex">
              <div className="header-content w-full">
                <Link to="/userprofile" className="font-bold mx-4 text-black">{user?.name}</Link>
                <img src="profile.png" className="w-[45px] drop-shadow-md mr-4" />
              </div>
            </div>
            <div className="body">
              <div className="h-full overflow-y-scroll">
                {children}
              </div>
            </div>
              
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
