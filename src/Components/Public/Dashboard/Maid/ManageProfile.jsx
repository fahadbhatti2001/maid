import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { db, auth, storage } from "@/FirebaseConfig";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { deleteObject, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBucket, faShirt, faBowlFood, faBabyCarriage, faSink, faStar } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from '@/Components'
import produce from 'immer';

export const ManageProfile = () => {

    let [data, setData] = useState()
    let [image, setImage] = useState(null)
    let [isImage, setIsImage] = useState(null)
    let [isUpdatedImage, setIsUpdatedImage] = useState(null)
    let [spin, setSpin] = useState(false);
    let [isEdit, setIsEdit] = useState(true)

    let imageName = new Date().getTime();

    const getData = async () => {
        const maidsRef = collection(db, "Maids")
        const maidData = await getDocs(maidsRef)
        let maid = maidData.docs.filter(x => x.id == auth.lastNotifiedUid)
        setData(maid[0]._document.data.value.mapValue.fields)
    };

    const { register, handleSubmit, setValue, formState: { errors } } = useForm()

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
    }

    function setDataToUpdate() {
        setValue("fname", data.fname.stringValue)
        setValue("lname", data.lname.stringValue)
        setValue("address", data.address.stringValue)
        setValue("experience", data.experience.stringValue)
        setValue("floor", data.floor.booleanValue)
        setValue("cloth", data.cloth.booleanValue)
        setValue("meal", data.meal.booleanValue)
        setValue("child", data.child.booleanValue)
        setValue("kitchen", data.kitchen.booleanValue)
        setIsUpdatedImage(data.image.stringValue)
        setImage(data.image.stringValue)
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

    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            <Spinner isBlinking={false} isSpinner={spin}></Spinner>
            <div className="body-main h-screen bg-violet-200">
                <div className="w-full h-[12vh] px-6 flex items-center bg-primary-3">
                    <h1 className="text-gray-700 md:text-4xl text-2xl font-bold">Dashboard</h1>
                </div>
                {
                    isEdit ?
                        <div className="w-full h-[88vh] overflow-auto p-6 cst-scrollbar">
                            <div className="bg-white rounded p-4 flex md:flex-row flex-col justify-between items-center">
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
                                            {data == undefined ? "" : data.address.stringValue}
                                        </p>
                                    </div>
                                </div>
                                <div className="md:w-auto w-full">
                                    <p className="text-base font-PoppinsMedium grid grid-cols-2 text-gray-700">
                                        <span className="font-PoppinsSemiBold">Status: </span>
                                        <span className={"text-right " + (data == undefined ? "" : data.approved.booleanValue == false ? "text-red-600" : data.approved.booleanValue == true ? "text-green-600" : "text-yellow-600")}>
                                            {data == undefined ? "" : data.approved.booleanValue == false ? "Unsatisfied" : data.approved.booleanValue == true ? "Satisfactory" : "Under Supervision"}
                                        </span>
                                    </p>
                                    <p className="text-base font-PoppinsMedium grid grid-cols-2 text-gray-700">
                                        <span className="font-PoppinsSemiBold">Rating: </span>
                                        <span className="text-right">5.0</span>
                                    </p>
                                    <button onClick={() => setDataToUpdate()} className="text-center w-full border-2 border-primary-0  rounded-full mt-2" type="button">
                                        Update Profile
                                    </button>
                                </div>
                            </div>
                            <div className=" grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-4 w-full mt-4">
                                <div className={"col-span-1 flex flex-col gap-4 justify-center items-center h-40 rounded-lg shadow bg-white text-primary-0 " + (data == undefined ? "" : data.floor.booleanValue == false ? "opacity-40" : "opacity-100")}>
                                    <FontAwesomeIcon icon={faBucket} className="text-4xl" />
                                    <h1 className="text-xl">
                                        Floor Cleaning
                                    </h1>
                                </div>
                                <div className={"col-span-1 flex flex-col gap-4 justify-center items-center h-40 rounded-lg shadow bg-white text-primary-0 " + (data == undefined ? "" : data.cloth.booleanValue == false ? "opacity-40" : "opacity-100")}>
                                    <FontAwesomeIcon icon={faShirt} className="text-4xl" />
                                    <h1 className="text-xl">
                                        Cloth Washing
                                    </h1>
                                </div>
                                <div className={"col-span-1 flex flex-col gap-4 justify-center items-center h-40 rounded-lg shadow bg-white text-primary-0 " + (data == undefined ? "" : data.meal.booleanValue == false ? "opacity-40" : "opacity-100")}>
                                    <FontAwesomeIcon icon={faBowlFood} className="text-4xl" />
                                    <h1 className="text-xl">
                                        Meal Cooking
                                    </h1>
                                </div>
                                <div className={"col-span-1 flex flex-col gap-4 justify-center items-center h-40 rounded-lg shadow bg-white text-primary-0 " + (data == undefined ? "" : data.child.booleanValue == false ? "opacity-40" : "opacity-100")}>
                                    <FontAwesomeIcon icon={faBabyCarriage} className="text-4xl" />
                                    <h1 className="text-xl">
                                        Child Care
                                    </h1>
                                </div>
                                <div className={"col-span-1 flex flex-col gap-4 justify-center items-center h-40 rounded-lg shadow bg-white text-primary-0 " + (data == undefined ? "" : data.kitchen.booleanValue == false ? "opacity-40" : "opacity-100")}>
                                    <FontAwesomeIcon icon={faSink} className="text-4xl" />
                                    <h1 className="text-xl">
                                        Kitchen Handling
                                    </h1>
                                </div>
                            </div>
                            <div className=" grid md:grid-cols-3 grid-cols-1 gap-4 w-full mt-4">
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
