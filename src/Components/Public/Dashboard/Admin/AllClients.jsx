import React, { useEffect, useState } from 'react';
import { db } from '@/FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';


export const AllClients = () => {

  let [ data, setData ] = useState()
  const clientsRef = collection(db, "Clients")
  
  const getData = async () => {  
      const clientData = await getDocs(clientsRef)
      setData(clientData.docs.map((doc) => ({...doc.data(), id: doc.id})))
  };

  useEffect(() => {
      getData();
  }, [])

  return (
    <>
      <div className="body-main h-screen bg-violet-200">
        <div className="w-full h-[12vh] px-6 flex items-center bg-indigo-200">
          <h1 className="text-gray-700 md:text-4xl text-2xl font-bold">All Clients</h1>
        </div>
        <div className="w-full h-[88vh] overflow-auto p-6 cst-scrollbar">
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
            {
              data == undefined ? null : data.map((e, i) => (
                <button type="button" key={i} className="col-span-1 bg-white p-2 rounded flex flex-col justify-between items-center">
                  <img src={e.image} className="w-full h-48 object-cover rounded-t" />
                  <div className="w-full flex flex-col items-start py-2">
                    <h1 className="text-lg font-PoppinsMedium text-gray-700">
                      {e.fname} {e.lname}
                    </h1>
                    <h1 className="text-xs font-PoppinsRegular text-gray-700 mb-2">
                      {e.email}
                    </h1>
                    <div className="flex items-start gap-1 text-gray-500">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs mt-px" />
                      <p className="font-PoppinsMedium text-xs text-left">
                      {e.address}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            }
          </div>
        </div>
      </div>
    </>
  )
}
