import React, { useEffect, useState } from 'react';
import { db, storage } from "@/FirebaseConfig";
import { collection, doc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteObject, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBucket, faShirt, faBowlFood, faBabyCarriage, faSink, faStar, faMapMarkerAlt, faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import { Spinner } from '@/Components'
import produce from 'immer';
import Swal from 'sweetalert2';

export const AllMaids = () => {

  let [data, setData] = useState()
  let [image, setImage] = useState(null)
  let [isImage, setIsImage] = useState(null)
  let [isUpdatedImage, setIsUpdatedImage] = useState(null)
  let [spin, setSpin] = useState(false);
  let [isEdit, setIsEdit] = useState(true)
  const maidsRef = collection(db, "Maids")

  const getData = async () => {
    const maidData = await getDocs(maidsRef)
    setData(maidData.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  };

  useEffect(() => {
    getData();
  }, [])

  let imageName = new Date().getTime();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  }

  function setDataToUpdate(id) {
    let card = data.filter(x => x.id == id)
    setValue("id", card[0].id)
    setValue("fname", card[0].fname)
    setValue("lname", card[0].lname)
    setValue("address", card[0].address)
    setValue("experience", card[0].experience)
    setValue("floor", card[0].floor)
    setValue("cloth", card[0].cloth)
    setValue("meal", card[0].meal)
    setValue("child", card[0].child)
    setValue("kitchen", card[0].kitchen)
    setIsUpdatedImage(card[0].image)
    setImage(card[0].image)
    setIsEdit(false)
  }

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
            const maidDoc = doc(db, "Maids", updatedData.id);
            await updateDoc(maidDoc, inputDataCopy);
            setData(
              produce((draft) => {
                const maidData = draft.find((maidData) => maidData.id === updatedData.id);
                maidData.image = url
                maidData.fname = updatedData.fname
                maidData.lname = updatedData.lname
                maidData.address = updatedData.address
                maidData.experience = updatedData.experience
                maidData.floor = updatedData.floor
                maidData.cloth = updatedData.cloth
                maidData.meal = updatedData.meal
                maidData.child = updatedData.child
                maidData.kitchen = updatedData.kitchen
              })
            )
          })
        })
        Swal.fire({
          icon: "success",
          title: "Updated Successfully",
          toast: true,
          showCancelButton: false,
          animation: false,
          position: "top",
          timer: 3000,
          showConfirmButton: false,
          iconColor: "#000000",
        });
        setIsEdit(true)
        setSpin(false)
      } else {
        const maidDoc = doc(db, "Maids", updatedData.id);
        await updateDoc(maidDoc, updatedData);
        setData(
          produce((draft) => {
            const maidData = draft.find((maidData) => maidData.id === updatedData.id);
            maidData.fname = updatedData.fname
            maidData.lname = updatedData.lname
            maidData.address = updatedData.address
            maidData.experience = updatedData.experience
            maidData.floor = updatedData.floor
            maidData.cloth = updatedData.cloth
            maidData.meal = updatedData.meal
            maidData.child = updatedData.child
            maidData.kitchen = updatedData.kitchen
          })
        )
        Swal.fire({
          icon: "success",
          title: "Updated Successfully",
          toast: true,
          showCancelButton: false,
          animation: false,
          position: "top",
          timer: 3000,
          showConfirmButton: false,
          iconColor: "#000000",
        });
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
      Swal.fire({
        icon: "error",
        title: "Unable to delete",
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

  const deleteMaid = async (id, image) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3AB0FF",
        cancelButtonColor: "#F87474",
        confirmButtonText: "Yes, Delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setSpin(true);
          const maidDoc = doc(db, "Maids", id);
          const deletemaidimage = ref(storage, image);
          await deleteDoc(maidDoc);
          await deleteObject(deletemaidimage);
          const newData = data.filter((e) => e.id != id);
          setData(newData);
          setSpin(false);
          Swal.fire({
            icon: "success",
            title: "Deleted Successfully",
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
        title: "Unable to delete",
        toast: true,
        showCancelButton: false,
        animation: false,
        position: "top",
        timer: 3000,
        showConfirmButton: false,
        iconColor: "#000000",
      });
    }
  };

  return (
    <>
      <Spinner isBlinking={false} isSpinner={spin}></Spinner>
      <div className="body-main h-screen bg-violet-200">
        <div className="w-full h-[12vh] px-6 flex items-center bg-primary-3">
          <h1 className="text-gray-700 md:text-4xl text-2xl font-bold">All Maids</h1>
        </div>
        {
          isEdit ?
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
                          <button onClick={() => deleteMaid(e.id, e.image)} type="button" className="w-full text-red-500" >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                          <button onClick={() => setDataToUpdate(e.id)} type="button" className="w-full text-green-500" >
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
            :
            <div className="w-full h-[88vh] overflow-auto p-6 cst-scrollbar">
              <div className="p-8 rounded-lg w-full flex flex-col gap-4 items-center justify-center">
                <label htmlFor="image" className="w-32 h-32 block outline-none bg-zinc-100 rounded-full cursor-pointer">
                  <img src={image} className="w-32 h-32 object-cover rounded-full" />
                </label>
                <input id="image" onChange={(e) => { onImageChange(e), setIsImage(e.target.files[0]) }} accept="image/png, image/jpg, image/jpeg, image/tiff" type="file" />
                <div className="flex flex-col w-full">
                  <div className="flex lg:flex-row flex-col lg:gap-4 gap-0">
                    <div className="flex flex-col w-full">
                      <label htmlFor="fname" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">First Name</label>
                      <input type="text" {...register("fname", { required: true })} id="fname" placeholder="Enter your First Name" className={(errors.fname ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-4 placeholder:text-xs focus:outline-primary-0"} />
                    </div>
                    <div className="flex flex-col w-full">
                      <label htmlFor="lname" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">Last Name</label>
                      <input type="text" {...register("lname", { required: true })} id="lname" placeholder="Enter your Last Name" className={(errors.lname ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-4 placeholder:text-xs focus:outline-primary-0"} />
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <label htmlFor="address" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">Address</label>
                    <input type="text" {...register("address", { required: true })} id="address" placeholder="Enter your Full Address" className={(errors.address ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-4 placeholder:text-xs focus:outline-primary-0"} />
                  </div>
                  <div className="flex lg:flex-row flex-col gap-4">
                    <div className="flex flex-col w-full gap-2">
                      <p className="font-PoppinsRegular text-sm text-zinc-800 pl-1">
                        Experience
                      </p>
                      <div className="flex items-center gap-2 w-full">
                        <input type="radio" {...register("experience", { required: true })} className={errors.experience ? "accent-primary-0 validation" : "accent-primary-0 border border-transparent"} value="lessthanone" id="lessthanone" />
                        <label htmlFor="lessthanone" className="font-PoppinsRegular text-sm text-zinc-800">Less then 1 Year</label>
                      </div>
                      <div className="flex items-center gap-2 w-full">
                        <input type="radio" {...register("experience", { required: true })} className={errors.experience ? "accent-primary-0 validation" : "accent-primary-0 border border-transparent"} value="oneyear" id="oneyear" />
                        <label htmlFor="oneyear" className="font-PoppinsRegular text-sm text-zinc-800">1 Year</label>
                      </div>
                      <div className="flex items-center gap-2 w-full">
                        <input type="radio" {...register("experience", { required: true })} className={errors.experience ? "accent-primary-0 validation" : "accent-primary-0 border border-transparent"} value="twotothree" id="twotothree" />
                        <label htmlFor="twotothree" className="font-PoppinsRegular text-sm text-zinc-800">2 - 3 Years</label>
                      </div>
                      <div className="flex items-center gap-2 w-full">
                        <input type="radio" {...register("experience", { required: true })} className={errors.experience ? "accent-primary-0 validation" : "accent-primary-0 border border-transparent"} value="fourtofive" id="fourtofive" />
                        <label htmlFor="fourtofive" className="font-PoppinsRegular text-sm text-zinc-800">4 - 5 Years</label>
                      </div>
                      <div className="flex items-center gap-2 w-full">
                        <input type="radio" {...register("experience", { required: true })} className={errors.experience ? "accent-primary-0 validation" : "accent-primary-0 border border-transparent"} value="fiveabove" id="fiveabove" />
                        <label htmlFor="fiveabove" className="font-PoppinsRegular text-sm text-zinc-800">Above then 5 Years</label>
                      </div>
                    </div>
                    <div className="flex flex-col w-full gap-2">
                      <p className="font-PoppinsRegular text-sm text-zinc-800 pl-1">
                        Experties
                      </p>
                      <div className="flex items-center gap-2 w-full">
                        <input type="checkbox" {...register("floor")} className="accent-primary-0" id="floor" />
                        <label htmlFor="floor" className="font-PoppinsRegular text-sm text-zinc-800">Floor Cleaning</label>
                      </div>
                      <div className="flex items-center gap-2 w-full">
                        <input type="checkbox" {...register("cloth")} className="accent-primary-0" id="cloth" />
                        <label htmlFor="cloth" className="font-PoppinsRegular text-sm text-zinc-800">Cloth Cleaning</label>
                      </div>
                      <div className="flex items-center gap-2 w-full">
                        <input type="checkbox" {...register("meal")} className="accent-primary-0" id="meal" />
                        <label htmlFor="meal" className="font-PoppinsRegular text-sm text-zinc-800">Meal Cooking</label>
                      </div>
                      <div className="flex items-center gap-2 w-full">
                        <input type="checkbox" {...register("child")} className="accent-primary-0" id="child" />
                        <label htmlFor="child" className="font-PoppinsRegular text-sm text-zinc-800">Child Care</label>
                      </div>
                      <div className="flex items-center gap-2 w-full">
                        <input type="checkbox" {...register("kitchen")} className="accent-primary-0" id="kitchen" />
                        <label htmlFor="kitchen" className="font-PoppinsRegular text-sm text-zinc-800">Kitchen Handling</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center w-full">
                  <button onClick={handleSubmit(onSubmit)} type="button" className="font-PoppinsRegular text-base py-2 w-full hover:bg-primary-0 hover:text-white border-2 border-primary-0 text-primary-0 rounded-full shadow-sm mt-2 transition-all delay-75 ease-in-out">
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
        }
      </div>
    </>
  )
}
