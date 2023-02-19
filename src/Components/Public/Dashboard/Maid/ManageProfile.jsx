import React, { useEffect, useState } from 'react';
import { db, auth } from '@/FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export const ManageProfile = () => {

    let [ data, setData ] = useState()
    let [ isEdit, setIsEdit ] = useState(true)

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
            <div className="w-full h-[12vh] px-6 flex items-center bg-indigo-200">
                <h1 className="text-gray-700 md:text-4xl text-2xl font-bold">Manage Profile</h1>
            </div>
            {
                isEdit ? 
                <div className="w-full h-[88vh] overflow-auto p-6 cst-scrollbar">
                    <div className="flex md:flex-row flex-col items-center gap-4">
                        <img src={data == undefined ? "" : data.image.stringValue} className="w-40 h-40 object-cover rounded-lg" />
                        <div className="md:text-left text-center">
                            <h1 className="text-2xl font-PoppinsSemiBold text-gray-700">
                                {data == undefined ? "" : data.fname.stringValue} {data == undefined ? "" : data.lname.stringValue}
                            </h1>
                            <p className="text-base font-PoppinsRegular text-gray-700">
                                {data == undefined ? "" : data.email.stringValue}
                            </p>
                            <p className="text-base font-PoppinsRegular text-gray-700">
                                House no 8, Block N, Subzazar Scheme, Lahore
                                {/* {data == undefined ? "" : data.address.stringValue} */}
                            </p>
                        </div>
                    </div>
                </div>
                :
                <div className="w-full h-[88vh] overflow-auto p-6 cst-scrollbar"></div>
            }
        </div>
    </>
  )
}
