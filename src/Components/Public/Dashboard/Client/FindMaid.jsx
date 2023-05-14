import React, { useEffect, useState } from 'react';
import { db } from "@/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBucket, faShirt, faBowlFood, faBabyCarriage, faSink, faStar, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons';

export const FindMaid = () => {

  let [data, setData] = useState()
  let [isShow, setIsShow] = useState(true)
  let [showData, setShowData] = useState({})
  const maidsRef = collection(db, "Maids")

  const getData = async () => {
    const maidData = await getDocs(maidsRef)
    setData(maidData.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  };

  useEffect(() => {
    getData();
  }, [])

  function setDataToShow(id) {
    let card = data.filter(x => x.id == id)
    setShowData(card[0])
    setIsShow(false)
  }

  return (
    <>
      <div className="body-main h-screen bg-violet-200">
        <div className="w-full h-[12vh] px-6 flex items-center bg-primary-3">
          <h1 className="text-gray-700 md:text-4xl text-2xl font-bold">All Maids</h1>
        </div>
        {
          isShow ?
            <div className="w-full h-[88vh] overflow-auto p-6 cst-scrollbar">
              <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                {
                  data == undefined ? null : data.map((e, i) => e.approve == true ? (
                    <button onClick={() => setDataToShow(e.id)} type="button" key={i} className="col-span-1 bg-white p-2 rounded flex flex-col justify-center items-center border">
                      <img src={e.image} className="w-full h-48 object-cover rounded-t" />
                      <div className="w-full flex flex-col items-start mt-2 gap-1">
                        <h1 className="text-lg font-PoppinsMedium text-gray-700">
                          {e.fname} {e.lname}
                        </h1>
                        <h1 className="text-xs font-PoppinsRegular text-gray-700">
                          {e.email}
                        </h1>
                        <div className="flex items-start gap-1 text-gray-500">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs mt-px" />
                          <p className="font-PoppinsMedium text-xs text-left w-52 text-ellipsis overflow-hidden whitespace-nowrap">
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
                            <p className="font-PoppinsMedium text-sm">5.0</p>
                          </div>
                        </div>
                      </div>
                    </button>
                  ) : null)
                }
              </div>
            </div>
            :
            <div className="w-full h-[88vh] overflow-auto p-6 cst-scrollbar">
              <button onClick={() => setIsShow(true)} className="flex items-center gap-2 text-base text-zinc-700 mb-2">
                <FontAwesomeIcon icon={faCircleLeft} />
                Floor Cleaning
              </button>
              <div className="bg-white rounded p-4 flex md:flex-row flex-col justify-between items-center">
                <div className="flex md:flex-row flex-col items-center gap-4">
                  <img src={showData.image} className="w-40 h-40 object-cover rounded-lg" />
                  <div className="md:text-left text-center">
                    <h1 className="text-2xl font-PoppinsSemiBold text-gray-700">
                      {showData.fname} {showData.lname}
                    </h1>
                    <p className="text-base font-PoppinsRegular text-gray-700">
                      {showData.email}
                    </p>
                    <p className="text-base font-PoppinsRegular text-gray-700">
                      {showData.address}
                    </p>
                  </div>
                </div>
                <div className="md:w-auto w-full">
                  <p className="text-base font-PoppinsMedium grid grid-cols-2 text-gray-700">
                    <span className="font-PoppinsSemiBold">Status: </span>
                    <span className={"text-right " + (showData.approve == false ? "text-red-600" : showData.approve == true ? "text-green-600" : "text-yellow-600")}>
                      {showData.approve == false ? "Unsatisfied" : showData.approve == true ? "Satisfactory" : "Under Supervision"}
                    </span>
                  </p>
                  <p className="text-base font-PoppinsMedium grid grid-cols-2 text-gray-700">
                    <span className="font-PoppinsSemiBold">Rating: </span>
                    <span className="text-right">5.0</span>
                  </p>
                </div>
              </div>
              <div className=" grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-4 w-full mt-4">
                <div className={"col-span-1 flex-col gap-4 justify-center items-center h-40 rounded-lg shadow bg-white text-primary-0 " + (showData.floor == false ? "hidden" : "flex")}>
                  <FontAwesomeIcon icon={faBucket} className="text-4xl" />
                  <h1 className="text-xl">
                    Floor Cleaning
                  </h1>
                </div>
                <div className={"col-span-1 flex-col gap-4 justify-center items-center h-40 rounded-lg shadow bg-white text-primary-0 " + (showData.cloth == false ? "hidden" : "flex")}>
                  <FontAwesomeIcon icon={faShirt} className="text-4xl" />
                  <h1 className="text-xl">
                    Cloth Washing
                  </h1>
                </div>
                <div className={"col-span-1 flex-col gap-4 justify-center items-center h-40 rounded-lg shadow bg-white text-primary-0 " + (showData.meal == false ? "hidden" : "flex")}>
                  <FontAwesomeIcon icon={faBowlFood} className="text-4xl" />
                  <h1 className="text-xl">
                    Meal Cooking
                  </h1>
                </div>
                <div className={"col-span-1 flex-col gap-4 justify-center items-center h-40 rounded-lg shadow bg-white text-primary-0 " + (showData.child == false ? "hidden" : "flex")}>
                  <FontAwesomeIcon icon={faBabyCarriage} className="text-4xl" />
                  <h1 className="text-xl">
                    Child Care
                  </h1>
                </div>
                <div className={"col-span-1 flex-col gap-4 justify-center items-center h-40 rounded-lg shadow bg-white text-primary-0 " + (showData.kitchen == false ? "hidden" : "flex")}>
                  <FontAwesomeIcon icon={faSink} className="text-4xl" />
                  <h1 className="text-xl">
                    Kitchen Handling
                  </h1>
                </div>
              </div>
              {/* <div className=" grid md:grid-cols-3 grid-cols-1 gap-4 w-full mt-4">
                <div className="col-span-1 py-4 flex flex-col gap-4 items-center rounded-lg shadow bg-white">
                  <div className="flex items-center gap-2 w-full px-4">
                    <img src="/images/profile.png" className="w-20 h-20 rounded-full object-cover" />
                    <div className="text-gray-700">
                      <h1 className="text-lg font-PoppinsSemiBold">
                        Fahad Bhatti
                      </h1>
                      <div className="flex items-center gap-1 w-full text-amber-500">
                        <FontAwesomeIcon icon={faStar} className="text-xs" />
                        <p className="font-PoppinsMedium  text-sm">5.0</p>
                      </div>
                    </div>
                  </div>
                  <p className="font-PoppinsRegular text-sm px-4 text-gray-700">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et, dolores quisquam voluptas illo laboriosam dicta eos autem natus labore aspernatur sed ipsa. Optio, cupiditate amet! Similique nostrum deserunt earum necessitatibus?
                  </p>
                </div>
                <div className="col-span-1 py-4 flex flex-col gap-4 items-center rounded-lg shadow bg-white">
                  <div className="flex items-center gap-2 w-full px-4">
                    <img src="/images/profile.png" className="w-20 h-20 rounded-full object-cover" />
                    <div className="text-gray-700">
                      <h1 className="text-lg font-PoppinsSemiBold">
                        Fahad Bhatti
                      </h1>
                      <div className="flex items-center gap-1 w-full text-amber-500">
                        <FontAwesomeIcon icon={faStar} className="text-xs" />
                        <p className="font-PoppinsMedium  text-sm">5.0</p>
                      </div>
                    </div>
                  </div>
                  <p className="font-PoppinsRegular text-sm px-4 text-gray-700">
                    Lorem ipsum dol! Similique nostrum deserunt earum necessitatibus?
                  </p>
                </div>
              </div> */}
            </div>
        }
      </div>
    </>
  )
}
