import React, {useState} from 'react'
import { Header, Footer } from '@/Components';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { db, auth, storage } from '@/FirebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Spinner } from '@/Components';
import Swal from 'sweetalert2'

export const MaidRegister = () => {

    let imageName =  new Date().getTime()
    let [ image, setImage ] = useState(null)
    let [ isImage, setIsImage ] = useState(null)
    let [ spin, setSpin ] = useState(false);

    const navigate = useNavigate();

    function redirectTo() {
        navigate('/');
    }

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
    }

    const { register, handleSubmit, formState: {errors} } = useForm()

    async function onSubmit(data){
        if(image != null){
            try {
                setSpin(true);
                const imageRef = ref(storage, `images/${imageName}`)
                uploadBytes(imageRef, isImage).then((snapshot) => {
                    getDownloadURL(snapshot.ref).then( async url => {
                        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
                        const user = userCredential.user
    
                        const inputDataCopy = {...data}
                        inputDataCopy.timestamp = serverTimestamp()
                        inputDataCopy.image = url
    
                        await setDoc(doc(db, 'Maids', user.uid), inputDataCopy)
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
                console.log("Error")
            }
        }
        else{
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
                        Sign up to find work
                    </h1>
                    <label htmlFor="image" className="w-32 h-32 block outline-none bg-zinc-100 rounded-full cursor-pointer">
                        {
                            image == null ? 
                            <img src="/images/Camera.svg" className="p-10 w-full rounded-none" />
                            :
                            <img src={image} className="w-32 h-32 object-cover rounded-full" />
                        }
                    </label>
                    <input id="image" onChange={(e) => {onImageChange(e), setIsImage(e.target.files[0])}} accept="image/png, image/jpg, image/jpeg, image/tiff" type="file" />
                    <div className="flex flex-col w-full">
                        <div className="flex lg:flex-row flex-col lg:gap-4 gap-0">
                            <div className="flex flex-col w-full">
                                <label htmlFor="fname" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">First Name</label>
                                <input type="text" {...register("fname", {required: true})}  id="fname" placeholder="Enter your First Name" className={(errors.fname ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-4 placeholder:text-xs focus:outline-primary-0"}/>
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="lname" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">Last Name</label>
                                <input type="text" {...register("lname", {required: true})} id="lname" placeholder="Enter your Last Name" className={(errors.lname ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-4 placeholder:text-xs focus:outline-primary-0"}/>
                            </div>
                        </div>
                        <div className="flex lg:flex-row flex-col lg:gap-4 gap-0">
                            <div className="flex flex-col w-full">
                                <label htmlFor="email" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">Email</label>
                                <input type="email" {...register("email", {required: true})} id="email" placeholder="Enter your Email" className={(errors.email ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-4 placeholder:text-xs focus:outline-primary-0"}/>
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="password" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">Password</label>
                                <input type="password" {...register("password", {required: true, minLength: 8})} id="password" placeholder="Enter your Password" className={(errors.password ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-4 placeholder:text-xs focus:outline-primary-0"}/>
                            </div>
                        </div>
                        <div className="flex flex-col w-full">
                            <label htmlFor="address" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">Address</label>
                            <input type="text" {...register("address", {required: true})} id="address" placeholder="Enter your Full Address" className={(errors.address ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-4 placeholder:text-xs focus:outline-primary-0"}/>
                        </div>
                        <div className="flex lg:flex-row flex-col gap-4">
                            <div className="flex flex-col w-full gap-2">
                                <p className="font-PoppinsRegular text-sm text-zinc-800 pl-1">
                                    Experience
                                </p>
                                <div className="flex items-center gap-2 w-full">
                                    <input type="radio" {...register("experience", {required: true})} className={errors.experience ? "accent-primary-0 validation" : "accent-primary-0 border border-transparent"} value="lessthanone" id="lessthanone"/>
                                    <label htmlFor="lessthanone" className="font-PoppinsRegular text-sm text-zinc-800">Less then 1 Year</label>
                                </div>
                                <div className="flex items-center gap-2 w-full">
                                    <input type="radio" {...register("experience", {required: true})} className={errors.experience ? "accent-primary-0 validation" : "accent-primary-0 border border-transparent"} value="oneyear" id="oneyear"/>
                                    <label htmlFor="oneyear" className="font-PoppinsRegular text-sm text-zinc-800">1 Year</label>
                                </div>
                                <div className="flex items-center gap-2 w-full">
                                    <input type="radio" {...register("experience", {required: true})} className={errors.experience ? "accent-primary-0 validation" : "accent-primary-0 border border-transparent"} value="twotothree" id="twotothree"/>
                                    <label htmlFor="twotothree" className="font-PoppinsRegular text-sm text-zinc-800">2 - 3 Years</label>
                                </div>
                                <div className="flex items-center gap-2 w-full">
                                    <input type="radio" {...register("experience", {required: true})} className={errors.experience ? "accent-primary-0 validation" : "accent-primary-0 border border-transparent"} value="fourtofive" id="fourtofive"/>
                                    <label htmlFor="fourtofive" className="font-PoppinsRegular text-sm text-zinc-800">4 - 5 Years</label>
                                </div>
                                <div className="flex items-center gap-2 w-full">
                                    <input type="radio" {...register("experience", {required: true})} className={errors.experience ? "accent-primary-0 validation" : "accent-primary-0 border border-transparent"} value="fiveabove" id="fiveabove"/>
                                    <label htmlFor="fiveabove" className="font-PoppinsRegular text-sm text-zinc-800">Above then 5 Years</label>
                                </div>
                            </div>
                            <div className="flex flex-col w-full gap-2">
                                <p className="font-PoppinsRegular text-sm text-zinc-800 pl-1">
                                    Experties
                                </p>
                                <div className="flex items-center gap-2 w-full">
                                    <input type="checkbox" {...register("floor")} className="accent-primary-0" id="floor"/>
                                    <label htmlFor="floor" className="font-PoppinsRegular text-sm text-zinc-800">Floor Cleaning</label>
                                </div>
                                <div className="flex items-center gap-2 w-full">
                                    <input type="checkbox" {...register("cloth")} className="accent-primary-0" id="cloth"/>
                                    <label htmlFor="cloth" className="font-PoppinsRegular text-sm text-zinc-800">Cloth Cleaning</label>
                                </div>
                                <div className="flex items-center gap-2 w-full">
                                    <input type="checkbox" {...register("meal")} className="accent-primary-0" id="meal"/>
                                    <label htmlFor="meal" className="font-PoppinsRegular text-sm text-zinc-800">Meal Cooking</label>
                                </div>
                                <div className="flex items-center gap-2 w-full">
                                    <input type="checkbox" {...register("child")} className="accent-primary-0" id="child"/>
                                    <label htmlFor="child" className="font-PoppinsRegular text-sm text-zinc-800">Child Care</label>
                                </div>
                                <div className="flex items-center gap-2 w-full">
                                    <input type="checkbox" {...register("kitchen")} className="accent-primary-0" id="kitchen"/>
                                    <label htmlFor="kitchen" className="font-PoppinsRegular text-sm text-zinc-800">Kitchen Handling</label>
                                </div>
                            </div>
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
                                Looking for a maid ? &nbsp;
                            </p>
                            <Link to={'/client-register'} className="text-primary-0">
                                Register as Client
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
        <Footer/>
    </>
  )
}
