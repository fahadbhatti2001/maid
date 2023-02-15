import React from 'react'
import { Routes, Route } from "react-router-dom";
import { 
  Login, 
  Registration,
  UserAuthContextProvider,
} from "@/Components";

export const App = () => {
  return (
    <>
      <UserAuthContextProvider>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/register" element={<Registration/>}/>
        </Routes>
      </UserAuthContextProvider>
    </>
  )
}
