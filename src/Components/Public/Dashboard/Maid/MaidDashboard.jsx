import React, { useState } from 'react';
import { UseUserAuth } from '@/Components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff, faBroom, faUser, faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { ManageProfile } from './ManageProfile';
import { Reviews } from './Reviews';

export const MaidDashboard = () => {

    const navigate = useNavigate()

    let [ showManageProfile, setShowManageProfile ] = useState(true)
    let [ showReviews, setShowReviews ] = useState(false)

    const { logOut } = UseUserAuth();

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
                <div className="body-sidebar p-4 h-screen flex flex-col justify-between content-between">
                    <div className="">
                        <h1 className="font-PoppinsMediumItalic flex md:justify-start justify-center gap-2 text-xl">
                            <FontAwesomeIcon icon={faBroom} />
                            <p className="md:block hidden">
                                Online Maid Finder
                            </p>
                        </h1>
                        <div className="py-4 w-full">
                            <button onClick={() => {setShowManageProfile(true), setShowReviews(false)}} className="text-gray-700 md:p-4 p-0 md:py-4 py-6 w-full md:text-left text-center font-bold md:hover:bg-gray-300 hover:bg-transparent transition ease-in-out" type="button">
                                <p className="md:block hidden">
                                    Make / Update Profile
                                </p>
                                <FontAwesomeIcon icon={faUser} className="md:hidden inline-block md:text-base text-2xl"/>
                            </button>
                            <button onClick={() => {setShowManageProfile(false), setShowReviews(true)}} className="text-gray-700 md:p-4 p-0 md:py-4 py-6 w-full md:text-left text-center font-bold md:hover:bg-gray-300 hover:bg-transparent transition ease-in-out" type="button">
                                <p className="md:block hidden">
                                    Reviews
                                </p>
                                <FontAwesomeIcon icon={faStar} className="md:hidden inline-block md:text-base text-2xl"/>
                            </button>
                        </div>
                    </div>
                    <button onClick={handleLogout} type="button" className="text-gray-700 md:p-4 p-0 md:py-4 py-6 w-full text-left flex md:justify-between justify-center items-center font-bold md:hover:bg-gray-300 hover:bg-transparent transition ease-in-out">
                        <p className="md:block hidden">
                            Log Out
                        </p>
                        <FontAwesomeIcon icon={faPowerOff} className="md:text-base text-2xl" />
                    </button>
                </div>
                {
                    showManageProfile ? <ManageProfile/> : 
                    showReviews ? <Reviews/> : 
                    null
                }
            </div>
        </>
  )
}
