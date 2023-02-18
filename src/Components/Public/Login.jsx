import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons';
import { UseUserAuth, Header, Footer } from '@/Components';

export const Login = () => {
    
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [forgetEmail , setForgetEmail] = useState("")
    const [fotgetPassword, setForgetPassword] = useState(true)
    const { signIn, forgetPassword } = UseUserAuth()

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await signIn(email, password)
            navigate('/dashboard')
        } catch (error) {
            console.log("Error")
        }
    }

    const forgetHandleSubmit = async (e) => {
        e.preventDefault()
        try {
            await forgetPassword(forgetEmail)
            setForgetPassword(true)
        } catch (error) {
            console.log("Error")
        }
    }

    return (
        <>

            <Header position="static"/>
        
            <div className="flex justify-center h-[80vh] lg:px-20 md:px-12 px-6">
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
                            <input onChange={(e) => {setEmail(e.target.value)}} type="email" id="email" placeholder="Enter your email" className="font-PoppinsRegular text-base p-2 border border-gray-300 rounded shadow-sm mb-4 placeholder:text-xs placeholder:text-zinc-400 focus:outline-primary-0"/>
                            <label htmlFor="password" className="font-PoppinsRegular text-sm text-zinc-800 pb-2 pl-1">Password</label>
                            <input onChange={(e) => {setPassword(e.target.value)}} type="password" id="password" placeholder="Enter your password" className="font-PoppinsRegular text-base p-2 border border-gray-300 rounded shadow-sm mb-4 placeholder:text-xs placeholder:text-zinc-400 focus:outline-primary-0"/>
                            <div className="flex justify-end py-2">
                                <button onClick={() => setForgetPassword(false)} className="font-PoppinsRegular text-xs text-primary-0">
                                    Forget Password
                                </button>
                            </div>
                            <div className="flex justify-center">
                                <button onClick={handleSubmit} type="button" className="font-PoppinsRegular text-base py-2 px-8 hover:bg-primary-0 hover:text-white border-2 border-primary-0 text-primary-0 rounded-full shadow-sm mt-2 transition-all delay-75 ease-in-out">
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
            </div>

            <Footer/>

        </>
    );
};