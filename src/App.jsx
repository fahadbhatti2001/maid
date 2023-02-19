import React from 'react'
import { Routes, Route } from "react-router-dom";
import { 
  Login, 
  Registration,
  MaidRegister,
  ClientRegister,
  UserAuthContextProvider,
  ProtectedMaidLogin,
  ProtectedClientLogin,
  ProtectedMaidDashboard,
  ProtectedClientDashboard,
} from "@/Components";

export const App = () => {
  return (
    <>
      <UserAuthContextProvider>
        <Routes>
          <Route path="/" element={<ProtectedMaidLogin/>}/>
          <Route path="/" element={<ProtectedClientLogin/>}/>
          <Route path="/register" element={<Registration/>}/>
          <Route path="/maid-register" element={<MaidRegister/>}/>
          <Route path="/client-register" element={<ClientRegister/>}/>
          <Route path="/maid-dashboard" element={<ProtectedMaidDashboard/>}/>
          <Route path="/client-dashboard" element={<ProtectedClientDashboard/>}/>
        </Routes>
      </UserAuthContextProvider>
    </>
  )
}
