import React, { useEffect, useState } from 'react';
import { db, auth, storage } from "@/FirebaseConfig";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from '@/Components'

export const Reviews = () => {

    let [data, setData] = useState([])

    const getData = async () => {
        const maidsRef = collection(db, "Maids")
        const maidData = await getDocs(maidsRef)
        let maid = maidData.docs.filter(x => x.id == auth.lastNotifiedUid)
        setData(maid[0]._document.data.value.mapValue.fields)
    };

    useEffect(() => {
        getData();
    }, [])

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
                                data.reviews.arrayValue.values.map((e, i) => (
                                    <div key={i} className="col-span-1 py-4 flex flex-col gap-4 items-center rounded-lg shadow bg-white overflow-auto h-60">
                                        <div className="flex items-center gap-2 w-full px-4">
                                            <img src={e.mapValue.fields.image.stringValue} className="w-20 h-20 rounded-full object-cover" />
                                            <div className="text-gray-700">
                                                <h1 className="text-lg font-PoppinsSemiBold">
                                                    {e.mapValue.fields.name.stringValue}
                                                </h1>
                                                <div className="flex items-center gap-1 w-full text-amber-500">
                                                    <FontAwesomeIcon icon={faStar} className="text-xs" />
                                                    <p className="font-PoppinsMedium  text-sm">{e.mapValue.fields.rating.stringValue}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="font-PoppinsRegular text-sm px-4 text-gray-700 text-left w-full">
                                            {e.mapValue.fields.review.stringValue}
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
