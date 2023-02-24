import React from "react";
import { Navigate } from "react-router-dom";
import { UseUserAuth, AdminDashboard, Login } from '@/Components';

export const ProtectedAdminDashboard = () => {
    
    let { user } = UseUserAuth()
    if(!user){
       return  <Navigate to="/"/>
    }

    return <AdminDashboard/>
};

export const ProtectedAdminLogin = () => {
    
    let { user } = UseUserAuth()
    if(user){
       return  <Navigate to="/admin-dashboard"/>
    }

    return <Login/>
};