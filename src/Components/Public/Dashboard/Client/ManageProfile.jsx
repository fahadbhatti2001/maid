import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { db, auth, storage } from "@/FirebaseConfig";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { deleteObject, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Spinner } from '@/Components'
import produce from 'immer';
import Swal from 'sweetalert2';

export const ManageProfile = () => {

    let [data, setData] = useState()
    let [image, setImage] = useState(null)
    let [isImage, setIsImage] = useState(null)
    let [isUpdatedImage, setIsUpdatedImage] = useState(null)
    let [spin, setSpin] = useState(false);
    let [isEdit, setIsEdit] = useState(true)

    let imageName = new Date().getTime();

    const getData = async () => {
        const clientsRef = collection(db, "Clients")
        const clientData = await getDocs(clientsRef)
        let client = clientData.docs.filter(x => x.id == auth.lastNotifiedUid)
        setData(client[0]._document.data.value.mapValue.fields)
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
        setValue("phone", data.phone.stringValue)
        setValue("age", data.age.stringValue)
        setValue("gender", data.gender.stringValue)
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
                        const clientDoc = doc(db, "Clients", auth.lastNotifiedUid);
                        await updateDoc(clientDoc, inputDataCopy);
                        setData(
                            produce((draft) => {
                                draft.image.stringValue = url
                                draft.fname.stringValue = updatedData.fname
                                draft.lname.stringValue = updatedData.lname
                                draft.address.stringValue = updatedData.address
                                draft.phone.stringValue = updatedData.phone
                                draft.age.stringValue = updatedData.age
                                draft.gender.stringValue = updatedData.gender
                            })
                        )
                    })
                })
                setIsEdit(true)
                setSpin(false)
            } else {
                const clientDoc = doc(db, "Clients", auth.lastNotifiedUid);
                await updateDoc(clientDoc, updatedData);
                setData(
                    produce((draft) => {
                        draft.fname.stringValue = updatedData.fname
                        draft.lname.stringValue = updatedData.lname
                        draft.address.stringValue = updatedData.address
                        draft.phone.stringValue = updatedData.phone
                        draft.age.stringValue = updatedData.age
                        draft.gender.stringValue = updatedData.gender
                    })
                )
                setIsEdit(true)
                setSpin(false)
            }
            Swal.fire({
                icon: "success",
                title: "Update Successfully!",
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
                title: "Unable to update",
                toast: true,
                showCancelButton: false,
                animation: false,
                position: "top",
                timer: 3000,
                showConfirmButton: false,
                iconColor: "#C33149",
            });
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
                                    {
                                        data == undefined ?
                                            <div className="w-40 h-40 flex justify-center items-center">
                                                <div className="spinner-border animate-spin inline-block w-8 h-8 border-2 rounded-full text-primary-1" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                            :
                                            <img src={data.image.stringValue} className="w-40 h-40 object-cover rounded-lg" />
                                    }
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
                                    <button onClick={() => setDataToUpdate()} className="text-center w-full border-2 border-primary-0 rounded-full mt-2 px-4" type="button">
                                        Update Profile
                                    </button>
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
                                    <div className="flex lg:flex-row flex-col lg:gap-4 gap-0">
                                        <div className="flex flex-col w-full">
                                            <label htmlFor="phone" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">Phone Number</label>
                                            <input type="number" {...register("phone", { required: true })} id="phone" placeholder="Enter your Phone Number" className={(errors.phone ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-4 placeholder:text-xs focus:outline-primary-0"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label htmlFor="age" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">Age</label>
                                            <input type="number" {...register("age", { required: true })} id="age" placeholder="Enter your Age" className={(errors.age ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-4 placeholder:text-xs focus:outline-primary-0"} />
                                        </div>
                                    </div>
                                    <div className="flex lg:flex-row flex-col lg:gap-4 gap-0">
                                        <div className="flex flex-col w-full">
                                            <label htmlFor="address" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">Address</label>
                                            <input type="text" {...register("address", { required: true })} id="address" placeholder="Enter your Full Address" className={(errors.address ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-4 placeholder:text-xs focus:outline-primary-0"} />
                                        </div>
                                        <div className="flex flex-col gap-2 w-full">
                                            <label htmlFor="address" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">Address</label>
                                            <div className="flex gap-2 items-center">
                                                <label htmlFor="address" className="font-PoppinsRegular text-sm text-zinc-800">Male</label>
                                                <input type="radio" {...register("gender")} value="male" />
                                                <label htmlFor="address" className="font-PoppinsRegular text-sm text-zinc-800">Female</label>
                                                <input type="radio" {...register("gender")} value="female" />
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
