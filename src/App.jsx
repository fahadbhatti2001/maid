import React from 'react'
import { Routes, Route } from "react-router-dom";
import { 
  Login, 
  Registration,
  MaidRegister,
  ClientRegister,
  UserAuthContextProvider,
} from "@/Components";

export const App = () => {
  return (
    <>
      <UserAuthContextProvider>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/register" element={<Registration/>}/>
          <Route path="/maid-register" element={<MaidRegister/>}/>
          <Route path="/client-register" element={<ClientRegister/>}/>
        </Routes>
      </UserAuthContextProvider>
    </>
  )
}
