import React, { useEffect, useState } from 'react';
import { db } from "@/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { UseUserAuth, Popup, Spinner } from "@/Components"
import { useForm } from 'react-hook-form';
export const ClientOrders = () => {

  let [data, setData] = useState([])
  let [maidData, setMaidData] = useState([])
  let [spin, setSpin] = useState(false);
  let [showPopup, setShowPopup] = useState(false)

  const ordersRef = collection(db, "Orders")
  const maidRef = collection(db, "Maids")

  const { user } = UseUserAuth();

  const getData = async () => {
    const orderData = await getDocs(ordersRef)
    setData(orderData.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    const maidData = await getDocs(maidRef)
    setMaidData(maidData.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  };

  useEffect(() => {
    getData();
  }, [])

  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  const orderStatus = (status) => {
    let slug = ""
    if (status == 1) {
      slug = "Requested"
    }
    else if (status == 2) {
      slug = "In-Progress"
    }
    else if (status == 3) {
      slug = "Complete"
    }
    else if (status == 4) {
      slug = "Decline"
    }
    else if (status == 5) {
      slug = "Canceled"
    }
    return slug
  }

  const ordersData = (array) => {
    let specificUser = []
    array.forEach(e => {
      if (e.cid == user.uid) {
        specificUser.push(e)
      }
    });
    return specificUser
  }

  const showOrderDetail = (object) => {
    setValue("price", object.price)
    setValue("toDate", object.toDate)
    setValue("fromData", object.fromDate)
    setValue("description", object.description)
    setValue("address", object.address)
    setShowPopup(true)
  }

  return (
    <>
      <Spinner isBlinking={false} isSpinner={spin}></Spinner>
      <Popup
        title="Order Detail"
        open={showPopup}
        width="md:w-1/3"
        close={() => setShowPopup(false)}
      >
        <div className="flex flex-col gap-0">
          <div className="flex flex-col w-full">
            <label htmlFor="price" className="font-PoppinsRegular text-sm text-zinc-800 pb-1 pl-1">Price</label>
            <input disabled type="number" min={100} {...register("price", { required: true })} id="price" placeholder="Enter your Price" className={(errors.price ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-2 placeholder:text-xs focus:outline-primary-0"} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <label htmlFor="toDate" className="font-PoppinsRegular text-sm text-zinc-800 pb-1 pl-1">To</label>
              <input disabled type="date" {...register("toDate", { required: true })} id="toDate" className={(errors.toDate ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-2 placeholder:text-xs focus:outline-primary-0"} />
            </div>
            <div className="flex flex-col">
              <label htmlFor="fromDate" className="font-PoppinsRegular text-sm text-zinc-800 pb-1 pl-1">From</label>
              <input disabled type="date" {...register("fromDate", { required: true })} id="fromDate" className={(errors.fromDate ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-2 placeholder:text-xs focus:outline-primary-0"} />
            </div>
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="address" className="font-PoppinsRegular text-sm text-zinc-800 pb-1 pl-1">Address</label>
            <input disabled type="text" {...register("address", { required: true })} id="address" placeholder="Enter your Full Address" className={(errors.address ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-2 placeholder:text-xs focus:outline-primary-0"} />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="description" className="font-PoppinsRegular text-sm text-zinc-800 pb-1 pl-1">Description</label>
            <textarea disabled type="text" {...register("description", { required: true })} id="description" placeholder="Enter Full Description" className={(errors.description ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-2 placeholder:text-xs focus:outline-primary-0 h-40 resize-none cst-scrollbar"} />
          </div>
          <button onClick={() => ""} type="button" className="w-full mt-2 bg-primary-0 hover:bg-transparent border-2 border-primary-0 transition-all duration-75 text-white hover:text-primary-0 px-4 py-1 rounded">
            Cancel Order
          </button>
        </div>
      </Popup>
      <div className="body-main h-screen bg-violet-200">
        <div className="w-full h-[12vh] px-6 flex items-center bg-primary-3">
          <h1 className="text-gray-700 md:text-4xl text-2xl font-bold">My Orders</h1>
        </div>
        <div className="w-full h-[88vh] overflow-auto p-6 cst-scrollbar">
          <table className="text-white text-left w-full mt-4">
            <thead className="">
              <tr className="border-b-transparent text-sm text-zinc-600">
                <th className="bg-violet-300 p-4 text-ellipsis overflow-hidden w-80 rounded-tl-md">Description</th>
                <th className="bg-violet-300 p-4">Start Date</th>
                <th className="bg-violet-300 p-4">End Date</th>
                <th className="bg-violet-300 p-4">Status</th>
                <th className="bg-violet-300 p-4 rounded-tr-md text-center w-20">Action</th>
              </tr>
            </thead>
            <tbody className="">
              {
                data == undefined ? null : ordersData(data).map((e, i) => (
                  <tr key={i} className="text-sm text-zinc-600 font-light hover:bg-violet-100 hover:text-zinc-700 whitespace-nowrap border-b border-b-violet-300">
                    <td className="p-4 w-80">
                      <p className="text-ellipsis overflow-hidden w-80">
                        {e.description}
                      </p>
                    </td>
                    <td className="p-4">{e.price}</td>
                    <td className="p-4">{e.toDate}</td>
                    <td className="p-4">{orderStatus(e.status)}</td>
                    <td className="p-4 text-center w-20">
                      <button onClick={() => showOrderDetail(e)} type="button" className="">
                        Show
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
