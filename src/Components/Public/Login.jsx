import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons';
import { UseUserAuth, Header, Footer } from '@/Components';
import { useForm } from 'react-hook-form';
import { db, auth } from '@/FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Swal from 'sweetalert2';

export const Login = () => {

    const navigate = useNavigate()
    
    let [ getMaid, setGetMaid ] = useState()
    let [ getClient, setGetClient ] = useState()

    const [forgetEmail , setForgetEmail] = useState("")
    const [fotgetPassword, setForgetPassword] = useState(true)
    const { signIn, forgetPassword } = UseUserAuth()
    const maidsRef = collection(db, "Maids");
    const clientsRef = collection(db, "Clients");

    const getData = async () => {  
        const maidData = await getDocs(maidsRef)
        setGetMaid(maidData.docs)
        const clientData = await getDocs(clientsRef)
        setGetClient(clientData.docs)
    };

    useEffect(() => {
        getData();
    }, [])

    const { register, handleSubmit, formState: {errors} } = useForm()

    async function onSubmit(data){
        try {
            await signIn(data.email, data.password)
            let maid = getMaid.filter(x => x.id == auth.lastNotifiedUid)
            if(data.email == 'admin@gmail.com' && data.password == 'admin123'){
                navigate('/admin-dashboard')
            }
            else if(maid.length == 0){
                navigate('/client-dashboard')
            }
            else{
                navigate('/maid-dashboard')
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Wrong Credentials!",
                toast: true,
                showCancelButton: false,
                animation: false,
                position: "top",
                timer: 3000,
                showConfirmButton: false,
                iconColor: '#000000',
            });
        }
    }

    const forgetHandleSubmit = async (e) => {
        e.preventDefault()
        try {
            await forgetPassword(forgetEmail)
            setForgetPassword(true)
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Enter Registed Email!",
                toast: true,
                showCancelButton: false,
                animation: false,
                position: "top",
                timer: 3000,
                showConfirmButton: false,
                iconColor: '#000000',
            });
        }
    }

    return (
        <>

            <Header position="static"/>
        
            <div className="flex justify-evenly items-center md:h-[74vh] h-[80vh] lg:px-20 md:px-12 px-6">
                <div className="md:w-1/2 w-full place-items-center flex flex-col justify-center items-center">
                {
                    fotgetPassword ?
                    <div className="lg:w-3/4 w-full trhide bg-white rounded-lg p-8">
                        <h1 className="font-PoppinsSemiBold text-4xl text-zinc-800 pb-2 lg:text-left text-center">
                            Login
                        </h1>
                        <p className="font-PoppinsRegular text-xs text-zinc-800 pb-2 lg:text-left text-center">
                            Enter your credentials to access your account
                        </p>
                        <div className="flex flex-col pt-4">
                            <label htmlFor="email" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">Email</label>
                            <input {...register("email", {required: true})} type="email" id="email" placeholder="Enter your email" className={(errors.email ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-4 placeholder:text-xs focus:outline-primary-0"}/>
                            <label htmlFor="password" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">Password</label>
                            <input {...register("password", {required: true})} type="password" id="password" placeholder="Enter your password" className={(errors.password ? "placeholder:text-primary-0 border-primary-0" : "border-gray-300 placeholder:text-zinc-400") + "font-PoppinsRegular text-base p-2 border rounded shadow-sm mb-4 placeholder:text-xs focus:outline-primary-0"}/>
                            <div className="flex justify-end py-2">
                                <button onClick={() => setForgetPassword(false)} className="font-PoppinsRegular text-xs text-primary-0">
                                    Forget Password
                                </button>
                            </div>
                            <div className="flex justify-center">
                                <button onClick={handleSubmit(onSubmit)} type="button" className="font-PoppinsRegular text-base py-2 px-8 hover:bg-primary-0 hover:text-white border-2 border-primary-0 text-primary-0 rounded-full shadow-sm mt-2 transition-all delay-75 ease-in-out">
                                    Login
                                </button>
                            </div>
                            <div className="font-PoppinsRegular text-xs text-center mt-6">
                                Don't have an account ? &nbsp;
                                <Link to={'/register'} className="text-primary-0">
                                    Register Now
                                </Link>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="lg:w-3/4 w-full trshow bg-white rounded-lg p-8">
                        <button onClick={() => setForgetPassword(true)} type="button" className="flex items-center gap-2 text-base text-primary-0 py-2">
                            <FontAwesomeIcon icon={faCircleLeft} />
                            <p className="">Back to Login</p>
                        </button>
                        <h1 className="font-PoppinsSemiBold text-4xl text-zinc-800 pb-2 lg:text-left text-center">
                            Forget Password
                        </h1>
                        <p className="font-PoppinsRegular text-xs text-zinc-800 pb-2 lg:text-left text-center">
                            Enter your email to reset your password
                        </p>
                        <div className="flex flex-col pt-4">
                            <label htmlFor="email" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">Email</label>
                            <input onChange={(e) => {setForgetEmail(e.target.value)}} type="email" id="email" placeholder="Enter your email" className="font-PoppinsRegular text-base p-2 border border-gray-300 rounded shadow-sm mb-4 placeholder:text-xs placeholder:text-zinc-400 focus:outline-primary-0"/>
                            <div className="flex justify-center">
                                <button type="button" onClick={forgetHandleSubmit} className="font-PoppinsRegular text-base py-2 px-8 hover:bg-primary-0 hover:text-white border-2 border-primary-0 text-primary-0 rounded-full shadow-sm mt-2 transition-all delay-75 ease-in-out">
                                    Reset Password
                                </button>
                            </div>
                        </div>
                    </div>
                }
                </div>
                <img src="/images/Login.svg" className="w-[60vh] md:block hidden" />
            </div>

            <Footer/>

        </>
    );
};