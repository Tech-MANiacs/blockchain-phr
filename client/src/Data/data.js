export const userMenu = [
    {
        id: 0,
        name: "Home",
        path: '/dashboard',
        // icon from fontawesome
        icon: "fa-solid fa-house",
    },
    {
        id: 1,
        name: "Appointments",
        path:'/appointments',
        icon:"fa-solid fa-list",
    },
    {
        id: 2,
        name: "Apply as Doctor",
        path: "/apply-doctor",
        icon: "fa-solid fa-user",
    },
    {
        id: 3,
        name: "Profile",
        path: "/userprofile",
        icon: "fa-solid fa-user",
    },
   
    
];

//admin menu
export const adminMenu = [
    {
        id: 0,
        name: "Home",
        path: '/dashboard',
        // icon from fontawesome
        icon: "fa-solid fa-house",
    },
    {
        id: 1,
        name: "Doctors",
        path: "/admin/doctors",
        icon: "fa-solid fa-user",
    },
    {
        id: 2,
        name: "Users",
        path: "/admin/users",
        icon: "fa-solid fa-user",

    },
    {
        id: 3,
        name: "Profile",
        path: "/profile",
        icon: "fa-solid fa-user",
    },
    
    
];

//we'll map all this options in the layout file in the sidebar menu div
