import React, { useEffect, useState } from 'react';
import { db } from '@/FirebaseConfig';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBucket, faShirt, faBowlFood, faBabyCarriage, faSink, faStar, faMapMarkerAlt, faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import produce from 'immer';

export const AllMaids = () => {

  let [data, setData] = useState()
  const maidsRef = collection(db, "Maids")

  const getData = async () => {
    const clientData = await getDocs(maidsRef)
    setData(clientData.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  };

  useEffect(() => {
    getData();
  }, [])

  async function onSubmit(updatedData) {
    try {
      setSpin(true)
      if (isImage != null) {
        const deletePreviousimage = ref(storage, isUpdatedImage);
        await deleteObject(deletePreviousimage);
        const imageRef = ref(storage, `images/${imageName}`);
        uploadBytes(imageRef, isImage).then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async (url) => {
            const inputDataCopy = { ...updatedData };
            inputDataCopy.image = url;
            const maidDoc = doc(db, "Maids", auth.lastNotifiedUid);
            await updateDoc(maidDoc, inputDataCopy);
            setData(
              produce((draft) => {
                console.log(updatedData.lname)
                draft.image.stringValue = url
                draft.fname.stringValue = updatedData.fname
                draft.lname.stringValue = updatedData.lname
                draft.address.stringValue = updatedData.address
                draft.experience.stringValue = updatedData.experience
                draft.floor.booleanValue = updatedData.floor
                draft.cloth.booleanValue = updatedData.cloth
                draft.meal.booleanValue = updatedData.meal
                draft.child.booleanValue = updatedData.child
                draft.kitchen.booleanValue = updatedData.kitchen
              })
            )
          })
        })
        setIsEdit(true)
        setSpin(false)
      } else {
        const maidDoc = doc(db, "Maids", auth.lastNotifiedUid);
        await updateDoc(maidDoc, updatedData);
        setData(
          produce((draft) => {
            console.log(updatedData.lname)
            draft.fname.stringValue = updatedData.fname
            draft.lname.stringValue = updatedData.lname
            draft.address.stringValue = updatedData.address
            draft.experience.stringValue = updatedData.experience
            draft.floor.booleanValue = updatedData.floor
            draft.cloth.booleanValue = updatedData.cloth
            draft.meal.booleanValue = updatedData.meal
            draft.child.booleanValue = updatedData.child
            draft.kitchen.booleanValue = updatedData.kitchen
          })
        )
        setIsEdit(true)
        setSpin(false)
      }
    } catch (error) {
      console.log("error")
    }
  }

  async function approveMaid(data, status) {
    try {
      const inputDataCopy = { ...data };
      inputDataCopy.approve = status;
      const maidDoc = doc(db, "Maids", data.id);
      await updateDoc(maidDoc, inputDataCopy);
      setData(
        produce((draft) => {
          const maidData = draft.find((maidData) => maidData.id === data.id);
          maidData.approve = status
        })
      )
    } catch (error) {
      console.log("error")
    }
  }

  return (
    <>
      <div className="body-main h-screen bg-violet-200">
        <div className="w-full h-[12vh] px-6 flex items-center bg-indigo-200">
          <h1 className="text-gray-700 md:text-4xl text-2xl font-bold">All Maids</h1>
        </div>
        <div className="w-full h-[88vh] overflow-auto p-6 cst-scrollbar">
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
            {
              data == undefined ? null : data.map((e, i) => (
                <div type="button" key={i} className="col-span-1 bg-white p-2 rounded flex flex-col justify-center items-center border">
                  <img src={e.image} className="w-full h-48 object-cover rounded-t" />
                  <div className="w-full flex flex-col items-start py-2 gap-1">
                    <h1 className={"text-xs text-right w-full font-PoppinsMedium " + (e.approve == false ? "text-red-600" : e.approve == true ? "text-green-600" : "text-yellow-600")}>
                      {
                        e.approve == false ? "In-Active" : e.approve == true ? "Active" : "New"
                      }
                    </h1>
                    <h1 className="text-lg font-PoppinsMedium text-gray-700">
                      {e.fname} {e.lname}
                    </h1>
                    <h1 className="text-xs font-PoppinsRegular text-gray-700">
                      {e.email}
                    </h1>
                    <div className="flex items-start gap-1 text-gray-500">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs mt-px" />
                      <p className="font-PoppinsMedium text-xs text-left">
                        {e.address}
                      </p>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <div className="text-primary-0 flex gap-1">
                        {e.floor == true ? <FontAwesomeIcon icon={faBucket} className="text-sm" /> : null}
                        {e.cloth == true ? <FontAwesomeIcon icon={faShirt} className="text-sm" /> : null}
                        {e.meal == true ? <FontAwesomeIcon icon={faBowlFood} className="text-sm" /> : null}
                        {e.child == true ? <FontAwesomeIcon icon={faBabyCarriage} className="text-sm" /> : null}
                        {e.kitchen == true ? <FontAwesomeIcon icon={faSink} className="text-sm" /> : null}
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <FontAwesomeIcon icon={faStar} className="text-xs" />
                        <p className="font-PoppinsMedium  text-sm">5.0</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 w-full">
                    <button onClick={() => approveMaid(e, true)} className={"w-full py-1 font-PoppinsMedium text-white bg-green-500 " +
                      (e.approve == false ? "rounded col-span-2"
                        : e.approve == true ? "hidden col-span-2"
                          : "rounded-l col-span-1")
                    } type="button">Approve</button>
                    <button onClick={() => approveMaid(e, false)} className={"w-full py-1 font-PoppinsMedium text-white bg-red-500 " +
                      (e.approve == false ? "hidden col-span-2"
                        : e.approve == true ? "rounded col-span-2"
                          : "rounded-r col-span-1")
                    } type="button">Reject</button>
                    <div className="flex w-full">
                      <button onClick={() => ""} type="button" className="w-full text-red-500" >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button onClick={() => ""} type="button" className="w-full text-green-500" >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  )
}
