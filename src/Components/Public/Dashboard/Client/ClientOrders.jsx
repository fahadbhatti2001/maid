import React, { useEffect, useState } from 'react';
import { db } from "@/FirebaseConfig";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { UseUserAuth, Popup, Spinner } from "@/Components"
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import produce from 'immer';
export const ClientOrders = () => {

  let [data, setData] = useState([])
  let [maidData, setMaidData] = useState([])
  let [clientData, setClientData] = useState([])
  let [spin, setSpin] = useState(false);
  let [showPopup, setShowPopup] = useState(false)
  let [maidImage, setMaidImage] = useState("")
  let [orderId, setOrderId] = useState(0)
  let [showCancelPopup, setShowCancelPopup] = useState(false)
  let [showCancelDetailPopup, setShowCancelDetailPopup] = useState(false)
  let [cancelBy, setCancelBy] = useState(false)
  let [isRated, setIsRated] = useState(false)
  let [showAddReviewPopup, setShowAddReviewPopup] = useState(false)
  let [showReviewPopup, setShowReviewPopup] = useState(false)
  let [orderStatusBtn, setOrderStatusBtn] = useState(0)

  const clientRef = collection(db, "Clients")
  const ordersRef = collection(db, "Orders")
  const maidRef = collection(db, "Maids")

  const { user } = UseUserAuth();
  
  const getData = async () => {
    const maidData = await getDocs(maidRef)
    setMaidData(maidData.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    const clientData = await getDocs(clientRef)
    setClientData(clientData.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    const orderData = await getDocs(ordersRef)
    setData(orderData.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  };

  useEffect(() => {
    getData();
  }, [])

  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
  const { register: registerCancel, handleSubmit: handleSubmitCancel } = useForm()
  const { register: registerRating, handleSubmit: handleSubmitRating, setValue: setvalueRating, reset: resetRating } = useForm()


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
    setValue("cancel", "")
    setIsRated(object.isRated)
    setOrderId(object.id)
    setOrderStatusBtn(object.status)
    let maid = maidData.filter(x => x.id == object.mid)
    let client = clientData.filter(x => x.id == object.cid)
    setMaidImage(maid[0].image)
    setvalueRating("mid", object.mid)
    setvalueRating("image", client[0].image)
    setvalueRating("name", `${client[0].fname} ${client[0].lname}`)
    setvalueRating("review", object.review)
    setvalueRating("rating", object.rating)
    setValue("name", `${maid[0].fname} ${maid[0].lname}`)
    setValue("email", maid[0].email)
    setValue("phone", maid[0].phone)
    setValue("price", object.price)
    setValue("toDate", object.toDate)
    setValue("fromDate", object.fromDate)
    setValue("description", object.description)
    setValue("address", object.address)
    setValue("reason", object.reason)
    if (object.maidCancel == "" && object.clientCancel != "") {
      setValue("cancel", object.clientCancel)
      setCancelBy(true)
    }
    else if (object.maidCancel != "" && object.clientCancel == "") {
      setValue("cancel", object.maidCancel)
      setCancelBy(false)
    }
    setShowPopup(true)
  }

  const cancelOrder = async (formData) => {
    let order = data.filter(x => x.id == orderId)
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3AB0FF",
        cancelButtonColor: "#F87474",
        confirmButtonText: "Yes, Cancel it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const inputDataCopy = { ...order[0] };
          inputDataCopy.status = 5;
          inputDataCopy.clientCancel = formData.clientCancel;
          const orderDoc = doc(db, "Orders", orderId);
          await updateDoc(orderDoc, inputDataCopy);
          setData(
            produce((draft) => {
              const maidData = draft.find((maidData) => maidData.id === orderId);
              maidData.status = inputDataCopy.status
            })
          )
          setShowCancelPopup(false)
          setShowPopup(false)
          Swal.fire({
            icon: "success",
            title: "Order Canceled!",
            toast: true,
            showCancelButton: false,
            animation: false,
            position: "top",
            timer: 3000,
            showConfirmButton: false,
            iconColor: "#000000",
            confirmButtonColor: "#E0A800",
          });
        }
      });
    } catch (error) {
      setSpin(false);
      Swal.fire({
        icon: "error",
        title: "Unable to cancel",
        toast: true,
        showCancelButton: false,
        animation: false,
        position: "top",
        timer: 3000,
        showConfirmButton: false,
        iconColor: "#000000",
      });
    }
  }

  const addRating = async (formData) => {
    let order = data.filter(x => x.id == orderId)
    try {
      const inputDataCopy = { ...order[0] };
      inputDataCopy.rating = JSON.parse(formData.rating);
      inputDataCopy.review = formData.review;
      inputDataCopy.isRated = true;
      const orderDoc = doc(db, "Orders", orderId);
      await updateDoc(orderDoc, inputDataCopy);

      const maidDoc = doc(db, "Maids", formData.mid);
      const maidSnapshot = await getDoc(maidDoc);
      const maidData = maidSnapshot.data();
      delete formData.mid
      const newMaidData = [...maidData.reviews, formData];
      await updateDoc(maidDoc, { reviews: newMaidData });
      const newMaidDataRate = [...maidData.rate, JSON.parse(formData.rating)];
      await updateDoc(maidDoc, { rate: newMaidDataRate });

      setData(
        produce((draft) => {
          const maidData = draft.find((maidData) => maidData.id === orderId);
          maidData.isRated = inputDataCopy.isRated
          maidData.review = inputDataCopy.review
          maidData.rating = inputDataCopy.rating
        })
      )
      resetRating({
        image: "",
        name: "",
        rating: null,
        review: ""
      })
      setShowPopup(false)
      setShowAddReviewPopup(false)
      Swal.fire({
        icon: "success",
        title: "Review Filled!",
        toast: true,
        showCancelButton: false,
        animation: false,
        position: "top",
        timer: 3000,
        showConfirmButton: false,
        iconColor: "#A8C256",
        confirmButtonColor: "#E0A800",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to fill review",
        toast: true,
        showCancelButton: false,
        animation: false,
        position: "top",
        timer: 3000,
        showConfirmButton: false,
        iconColor: "#C33149",
      });;
    }
  }

  return (
    <>
      <Spinner isBlinking={false} isSpinner={spin}></Spinner>
      <Popup
        title="Order Detail"
        open={showPopup}
        width="md:w-1/2 w-11/12"
        close={() => setShowPopup(false)}
      >
        <div className="">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 flex flex-col w-full mt-px">
              <div className="flex justify-center items-center my-4">
                <img src={maidImage} className="h-40 w-40 object-cover rounde-md" />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="name" className="font-PoppinsRegular text-sm text-zinc-800 pb-1 pl-1">Name</label>
                <input disabled type="text" {...register("name", { required: true })} id="name" className={(errors.name ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-2 placeholder:text-sm focus:outline-primary-0"} />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="email" className="font-PoppinsRegular text-sm text-zinc-800 pb-1 pl-1">Email</label>
                <input disabled type="text" {...register("email", { required: true })} id="email" className={(errors.email ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-2 placeholder:text-sm focus:outline-primary-0"} />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="phone" className="font-PoppinsRegular text-sm text-zinc-800 pb-1 pl-1">Phone</label>
                <input disabled type="text" {...register("phone", { required: true })} id="phone" placeholder="No Phone Number" className={(errors.phone ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-2 placeholder:text-sm focus:outline-primary-0"} />
              </div>
            </div>
            <div className="col-span-2 flex flex-col gap-0">
              <div className="flex flex-col w-full">
                <label htmlFor="price" className="font-PoppinsRegular text-sm text-zinc-800 pb-1 pl-1">Price</label>
                <input disabled type="number" min={100} {...register("price", { required: true })} id="price" placeholder="Enter your Price" className={(errors.price ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-2 placeholder:text-sm focus:outline-primary-0"} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <label htmlFor="toDate" className="font-PoppinsRegular text-sm text-zinc-800 pb-1 pl-1">To</label>
                  <input disabled type="date" {...register("toDate", { required: true })} id="toDate" className={(errors.toDate ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-2 placeholder:text-sm focus:outline-primary-0"} />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="fromDate" className="font-PoppinsRegular text-sm text-zinc-800 pb-1 pl-1">From</label>
                  <input disabled type="date" {...register("fromDate", { required: true })} id="fromDate" className={(errors.fromDate ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-2 placeholder:text-sm focus:outline-primary-0"} />
                </div>
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="address" className="font-PoppinsRegular text-sm text-zinc-800 pb-1 pl-1">Address</label>
                <input disabled type="text" {...register("address", { required: true })} id="address" placeholder="Enter your Full Address" className={(errors.address ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-2 placeholder:text-sm focus:outline-primary-0"} />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="description" className="font-PoppinsRegular text-sm text-zinc-800 pb-1 pl-1">Description</label>
                <textarea disabled type="text" {...register("description", { required: true })} id="description" placeholder="Enter Full Description" className={(errors.description ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-2 placeholder:text-sm focus:outline-primary-0 h-40 resize-none cst-scrollbar"} />
              </div>
            </div>
          </div>
          {
            orderStatusBtn == 1 ?
              <button onClick={() => setShowCancelPopup(true)} type="button" className="w-full mt-2 bg-primary-0 hover:bg-transparent border-2 border-primary-0 transition-all duration-75 text-white hover:text-primary-0 px-4 py-1 rounded">
                Cancel Order
              </button>
              : orderStatusBtn == 2 ?
                <button onClick={() => setShowCancelPopup(true)} type="button" className="w-full mt-2 bg-primary-0 hover:bg-transparent border-2 border-primary-0 transition-all duration-75 text-white hover:text-primary-0 px-4 py-1 rounded">
                  Cancel Order
                </button>
                : orderStatusBtn == 3 ?
                  <div className="font-PoppinsRegular w-full flex justify-center items-center p-2">
                    {
                      isRated == false ?
                        <>
                          <p className="">You didn't review yet! &nbsp;</p>
                          <button onClick={() => setShowAddReviewPopup(true)} type="button" className="text-primary-0">Review Maid</button>
                        </>
                        :
                        <button onClick={() => setShowReviewPopup(true)} type="button" className="text-primary-0">See your Review</button>
                    }
                  </div>
                  : orderStatusBtn == 4 ?
                    <div className="flex flex-col w-full">
                      <label htmlFor="reason" className="font-PoppinsRegular text-sm text-zinc-800 pb-1 pl-1">Decline Reason</label>
                      <input disabled type="text" {...register("reason", { required: true })} id="reason" className={(errors.reason ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-2 placeholder:text-sm focus:outline-primary-0"} />
                    </div>
                    : orderStatusBtn == 5 ?
                      <div className="font-PoppinsRegular w-full flex justify-center items-center p-2">
                        Order Canceled by {cancelBy == true ? "You" : "Maid"} &nbsp;
                        <button onClick={() => setShowCancelDetailPopup(true)} type="button" className="text-primary-0">See Reason</button>
                      </div>
                      : null
          }
        </div>
      </Popup>
      <Popup
        title="Cancel Order"
        open={showCancelDetailPopup}
        width="w-1/3"
        close={() => setShowCancelDetailPopup(false)}
      >
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col w-full">
            <label htmlFor="cancel" className="font-PoppinsRegular text-sm text-zinc-800 pb-1 pl-1">Reason</label>
            <textarea disabled type="text" {...register("cancel", { required: true })} id="cancel" placeholder="Enter Full Reason for cancellation" className={(errors.cancel ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-2 placeholder:text-sm focus:outline-primary-0 h-40 resize-none cst-scrollbar"} />
          </div>
        </div>
      </Popup>
      <Popup
        title="Cancel Order"
        open={showCancelPopup}
        width="w-1/3"
        close={() => setShowCancelPopup(false)}
      >
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col w-full">
            <label htmlFor="clientCancel" className="font-PoppinsRegular text-sm text-zinc-800 pb-1 pl-1">Reason</label>
            <textarea type="text" {...registerCancel("clientCancel", { required: true })} id="clientCancel" placeholder="Enter Full Reason for cancellation" className={(errors.clientCancel ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-2 placeholder:text-sm focus:outline-primary-0 h-40 resize-none cst-scrollbar"} />
          </div>
          <button onClick={handleSubmitCancel(cancelOrder)} type="button" className="w-full mt-2 bg-primary-0 text-white px-4 py-1 rounded">
            Cancel Order
          </button>
        </div>
      </Popup>
      <Popup
        title="Review Maid"
        open={showAddReviewPopup}
        width="w-1/3"
        close={() => setShowAddReviewPopup(false)}
      >
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="cancel" className="font-PoppinsRegular text-sm text-zinc-800 pb-1 text-center">Rate your experience</label>
          <div className="grid grid-cols-5 w-full">
            <div className="flex justify-center items-center gap-2 w-full">
              <input type="radio" {...registerRating("rating", { required: true })} value="1" id="a" />
              <label htmlFor="a" className="font-PoppinsRegular text-sm text-zinc-800">1</label>
            </div>
            <div className="flex justify-center items-center gap-2 w-full">
              <input type="radio" {...registerRating("rating", { required: true })} value="2" id="b" />
              <label htmlFor="b" className="font-PoppinsRegular text-sm text-zinc-800">2</label>
            </div>
            <div className="flex justify-center items-center gap-2 w-full">
              <input type="radio" {...registerRating("rating", { required: true })} value="3" id="c" />
              <label htmlFor="c" className="font-PoppinsRegular text-sm text-zinc-800">3</label>
            </div>
            <div className="flex justify-center items-center gap-2 w-full">
              <input type="radio" {...registerRating("rating", { required: true })} value="4" id="d" />
              <label htmlFor="d" className="font-PoppinsRegular text-sm text-zinc-800">4</label>
            </div>
            <div className="flex justify-center items-center gap-2 w-full">
              <input type="radio" {...registerRating("rating", { required: true })} value="5" id="e" />
              <label htmlFor="e" className="font-PoppinsRegular text-sm text-zinc-800">5</label>
            </div>
          </div>
          <div className="flex flex-col w-full mt-4">
            <label htmlFor="review" className="font-PoppinsRegular text-sm text-zinc-800 pb-1 pl-1">Describe your experience</label>
            <textarea type="text" {...registerRating("review", { required: true })} id="review" placeholder="Write here..." className={(errors.review ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm placeholder:text-sm focus:outline-primary-0 h-40 resize-none cst-scrollbar"} />
          </div>
          <button onClick={handleSubmitRating(addRating)} type="button" className="w-full mt-2 bg-primary-0 text-white px-4 py-1 rounded">
            Submit
          </button>
        </div>
      </Popup>
      <Popup
        title="Review Details"
        open={showReviewPopup}
        width="w-1/3"
        close={() => setShowReviewPopup(false)}
      >
        <div className="flex flex-col gap-2 w-full">
          <div className="flex justify-between items-center w-full">
            <label htmlFor="rating" className="font-PoppinsRegular text-base text-zinc-800 pb-1 pl-1">Rating</label>
            <input type="text" disabled {...registerRating("rating", { required: true })} id="rating" placeholder="Enter Full Reason for cancellation" className={"font-PoppinsRegular text-base py-2 mb-2 bg-white w-4"} />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="review" className="font-PoppinsRegular text-sm text-zinc-800 pb-1 pl-1">Description</label>
            <textarea type="text" disabled {...registerRating("review", { required: true })} id="review" placeholder="Enter Full Reason for cancellation" className={(errors.review ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-2 placeholder:text-sm focus:outline-primary-0 h-40 resize-none cst-scrollbar"} />
          </div>
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
                <th className="bg-violet-300 p-4">Price</th>
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
                    <td className={"p-4 font-PoppinsMedium " + (
                      e.status == 1 ? "text-amber-600" :
                        e.status == 2 ? "text-blue-500" :
                          e.status == 3 ? "text-green-500" :
                            e.status == 4 ? "text-red-500" :
                              e.status == 5 ? "text-zinc-400" : ""
                    )}>{orderStatus(e.status)}</td>
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
