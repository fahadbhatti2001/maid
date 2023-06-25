import React, { useEffect, useState } from 'react';
import { db, auth, storage } from "@/FirebaseConfig";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Spinner, UseUserAuth } from '@/Components'

export const Reviews = () => {

    const maidsRef = collection(db, "Maids");
    const [data, setData] = useState([]);

    const { user } = UseUserAuth();

    const getData = async () => {
        const querySnapshot = await getDocs(maidsRef);
        const maidData = [];
        querySnapshot.forEach((doc) => {
            if (doc.id == user.uid) {
                maidData.push({ id: doc.id, ...doc.data() });
            }
        });
        setData(maidData[0].reviews);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <div className="body-main h-screen bg-violet-200">
                <div className="w-full h-[12vh] px-6 flex items-center bg-primary-3">
                    <h1 className="text-gray-700 md:text-4xl text-2xl font-bold">Dashboard</h1>
                </div>
                <div className="w-full h-[88vh] overflow-auto p-6 cst-scrollbar">
                    <div className=" grid md:grid-cols-3 grid-cols-1 gap-4 w-full mt-4">
                        {
                            data == undefined ? null :
                                data.map((e, i) => (
                                    <div key={i} className="col-span-1 py-4 flex flex-col gap-4 items-center rounded-lg shadow bg-white overflow-auto h-60">
                                        <div className="flex items-center gap-2 w-full px-4">
                                            <img src={e.image} className="w-20 h-20 rounded-full object-cover" />
                                            <div className="text-gray-700">
                                                <h1 className="text-lg font-PoppinsSemiBold">
                                                    {e.name}
                                                </h1>
                                                <div className="flex items-center gap-1 w-full text-amber-500">
                                                    <FontAwesomeIcon icon={faStar} className="text-xs" />
                                                    <p className="font-PoppinsMedium  text-sm">{e.rating}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="font-PoppinsRegular text-sm px-4 text-gray-700 text-left w-full">
                                            {e.review}
                                        </p>
                                    </div>
                                ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
