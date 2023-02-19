import React from "react";
import { Navigate } from "react-router-dom";
import { UseUserAuth, ClientDashboard, Login } from '@/Components';

export const ProtectedClientDashboard = () => {
    
    let { user } = UseUserAuth()
    if(!user){
       return  <Navigate to="/"/>
    }

    return <ClientDashboard/>
};

export const ProtectedClientLogin = () => {
    
    let { user } = UseUserAuth()
    if(user){
       return  <Navigate to="/client-dashboard"/>
    }

    return <Login/>
};