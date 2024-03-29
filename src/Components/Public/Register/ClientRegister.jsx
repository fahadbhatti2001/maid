import React, { useState } from 'react'
import { Header, Footer, UseUserAuth } from '@/Components';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { db, auth, storage } from '@/FirebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Spinner } from '@/Components';
import Swal from 'sweetalert2';

export const ClientRegister = () => {

    let imageName = new Date().getTime()
    let [image, setImage] = useState(null)
    let [isImage, setIsImage] = useState(null)
    let [spin, setSpin] = useState(false);

    const navigate = useNavigate();

    const { logOut } = UseUserAuth();

    async function redirectTo() {
        await logOut();
        navigate('/');
    }

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
    }

    const { register, handleSubmit, formState: { errors } } = useForm()

    async function onSubmit(data) {
        if (image != null) {
            try {
                setSpin(true);
                const imageRef = ref(storage, `images/${imageName}`)
                uploadBytes(imageRef, isImage).then((snapshot) => {
                    getDownloadURL(snapshot.ref).then(async url => {
                        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
                        const user = userCredential.user

                        const inputDataCopy = { ...data }
                        inputDataCopy.timestamp = serverTimestamp()
                        inputDataCopy.image = url
                        inputDataCopy.age = ""
                        inputDataCopy.gender = ""
                        inputDataCopy.phone = ""
                        inputDataCopy.order = []

                        await setDoc(doc(db, 'Clients', user.uid), inputDataCopy)
                        setSpin(false);
                        Swal.fire({
                            icon: "success",
                            title: "Account Created Successfully",
                            toast: true,
                            showCancelButton: false,
                            animation: false,
                            position: "top",
                            timer: 3000,
                            showConfirmButton: false,
                            iconColor: '#000000',
                        });
                        redirectTo()
                    })
                })
            }
            catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Unable to create",
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
        else {
            Swal.fire({
                icon: "error",
                title: "Please Upload Profle",
                toast: true,
                showCancelButton: false,
                animation: false,
                position: "top",
                timer: 3000,
                showConfirmButton: false,
                iconColor: '#000000',
                confirmButtonColor: '#F87474',
            });
        }
    }

    return (
        <>
            <Spinner isBlinking={false} isSpinner={spin}></Spinner>
            <Header position="static" />
            <div className="h-full lg:px-20 md:px-12 px-6 flex justify-center items-center trshow">
                <div className="bg-white p-8 rounded-lg lg:w-2/4 w-full flex flex-col gap-4 items-center justify-center">
                    <h1 className="md:text-4xl text-2xl font-PoppinsMedium block whitespace-nowrap text-center">
                        Sign up to hire
                    </h1>
                    <label htmlFor="image" className="w-32 h-32 block outline-none bg-zinc-100 rounded-full cursor-pointer">
                        {
                            image == null ?
                                <img src="/images/Camera.svg" className="p-10 w-full rounded-none" />
                                :
                                <img src={image} className="w-32 h-32 object-cover rounded-full" />
                        }
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
                                <label htmlFor="email" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">Email</label>
                                <input type="email" {...register("email", { required: true })} id="email" placeholder="Enter your Email" className={(errors.email ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-4 placeholder:text-xs focus:outline-primary-0"} />
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="password" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">Password</label>
                                <input type="password" {...register("password", { required: true })} id="password" placeholder="Enter your Password" className={(errors.password ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-4 placeholder:text-xs focus:outline-primary-0"} />
                            </div>
                        </div>
                        <div className="flex lg:flex-row flex-col lg:gap-4 gap-0">
                            <div className="flex flex-col w-full">
                                <label htmlFor="phone" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">Phone</label>
                                <input type="number" {...register("phone", { required: true, minLength: 8 })} id="phone" placeholder="Enter your Phone Number" className={(errors.phone ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-4 placeholder:text-xs focus:outline-primary-0"} />
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="address" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">Address</label>
                                <input type="text" {...register("address", { required: true })} id="address" placeholder="Enter your Full Address" className={(errors.address ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-4 placeholder:text-xs focus:outline-primary-0"} />
                            </div>
                        </div>
                        <div className="flex flex-col w-full">
                            <label htmlFor="description" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">Description</label>
                            <input type="text" {...register("description", { required: true })} id="description" placeholder="Enter your Full Description" className={(errors.address ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-4 placeholder:text-xs focus:outline-primary-0"} />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button onClick={handleSubmit(onSubmit)} type="button" className="font-PoppinsRegular text-base py-2 px-8 hover:bg-primary-0 hover:text-white border-2 border-primary-0 text-primary-0 rounded-full shadow-sm mt-2 transition-all delay-75 ease-in-out">
                            Create Account
                        </button>
                    </div>
                    <div className="flex justify-between w-full">
                        <div className="font-PoppinsRegular flex text-xs text-center mt-6">
                            <p className="lg:block hidden">
                                Looking for a work ? &nbsp;
                            </p>
                            <Link to={'/maid-register'} className="text-primary-0">
                                Register as Maid
                            </Link>
                        </div>
                        <div className="font-PoppinsRegular flex text-xs text-center mt-6">
                            <p className="lg:block hidden">
                                Have an account ? &nbsp;
                            </p>
                            <Link to={'/'} className="text-primary-0">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
