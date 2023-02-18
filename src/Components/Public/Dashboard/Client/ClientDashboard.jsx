import React, { useState } from 'react';
import { UseUserAuth } from '@/Components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff, faBroom } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { auth } from "@/FirebaseConfig";

export const ClientDashboard = () => {

    const navigate = useNavigate()

    let [ showAddDaddy, setShowAddDaddy ] = useState(false)
    let [ showManageDaddy, setShowManageDaddy ] = useState(true)
    let [ showReportDaddy, setShowReportDaddy ] = useState(false)

    const { logOut, user } = UseUserAuth();

    const handleLogout = async () => {
        try {
            await logOut();
            navigate("/");
        } catch (error) {
            console.log("error");
        }
    };

  return (
    <>
            <div className="w-full flex justify-between">
                <div className="body-sidebar bg-purple-200 p-4 h-screen flex flex-col justify-between content-between">
                    <div className="">
                        <h1 className="font-PoppinsMediumItalic text-2xl">
                            <FontAwesomeIcon icon={faBroom} />
                            Maid Finder
                        </h1>
                        <div className="py-4">
                            <button /*onClick={() => {setShowAddDaddy(true), setShowManageDaddy(false), setShowReportDaddy(false)}}*/ className="text-gray-700 p-4 w-full text-left font-bold hover:bg-gray-300 transition ease-in-out" type="button">
                                Manage Profile
                            </button>
                            <button /*onClick={() => {setShowAddDaddy(false), setShowManageDaddy(true), setShowReportDaddy(false)}}*/ className="text-gray-700 p-4 w-full text-left font-bold hover:bg-gray-300 transition ease-in-out" type="button">
                                Find Maid
                            </button>
                            <button /*onClick={() => {setShowAddDaddy(false), setShowManageDaddy(false), setShowReportDaddy(true)}}*/ className="text-gray-700 p-4 w-full text-left font-bold hover:bg-gray-300 transition ease-in-out" type="button">
                                Report Maid
                            </button>
                        </div>
                    </div>
                    <button onClick={handleLogout} type="button" className="text-gray-700 p-4 w-full text-left flex justify-between items-center font-bold hover:bg-gray-300 transition ease-in-out">
                        Log Out
                        <FontAwesomeIcon icon={faPowerOff}/>
                    </button>
                </div>

                {/* {
                    showAddDaddy ? <AddDaddy/> :
                    showManageDaddy ? <MaangeDaddies/> :
                    showReportDaddy ? <ReportDaddy/> :
                    null
                } */}
                
            </div>
        </>
  )
}
