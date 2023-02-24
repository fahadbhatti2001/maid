import React from 'react'
import { Routes, Route } from "react-router-dom";
import { 
  MaidRegister,
  Registration,
  ClientRegister,
  ProtectedMaidLogin,
  ProtectedAdminLogin,
  ProtectedClientLogin,
  ProtectedMaidDashboard,
  UserAuthContextProvider,
  ProtectedAdminDashboard,
  ProtectedClientDashboard,
} from "@/Components";

export const App = () => {
  return (
    <>
      <UserAuthContextProvider>
        <Routes>
          <Route path="/" element={<ProtectedMaidLogin/>}/>
          <Route path="/" element={<ProtectedAdminLogin/>}/>
          <Route path="/" element={<ProtectedClientLogin/>}/>
          <Route path="/register" element={<Registration/>}/>
          <Route path="/maid-register" element={<MaidRegister/>}/>
          <Route path="/client-register" element={<ClientRegister/>}/>
          <Route path="/maid-dashboard" element={<ProtectedMaidDashboard/>}/>
          <Route path="/admin-dashboard" element={<ProtectedAdminDashboard/>}/>
          <Route path="/client-dashboard" element={<ProtectedClientDashboard/>}/>
        </Routes>
      </UserAuthContextProvider>
    </>
  )
}
