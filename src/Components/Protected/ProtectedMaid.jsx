import React from "react";
import { Navigate } from "react-router-dom";
import { UseUserAuth, MaidDashboard, Login } from '@/Components';

export const ProtectedMaidDashboard = () => {
    
    let { user } = UseUserAuth()
    if(!user){
       return  <Navigate to="/"/>
    }

    return <MaidDashboard/>
};

export const ProtectedMaidLogin = () => {
    
    let { user } = UseUserAuth()
    if(user){
       return  <Navigate to="/maid-dashboard"/>
    }

    return <Login/>
};