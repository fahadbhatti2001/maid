import React from 'react';
import { Header, Footer } from '@/Components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export const Registration = () => {

  return (
        <>
            <Header position="static"/>
            <div className="md:h-[74vh] h-[80vh] lg:px-20 md:px-12 px-6 flex justify-center items-center trshow">
                <div className="bg-white p-8 rounded-lg md:w-2/4 w-full flex flex-col gap-4 items-center justify-center">
                    <h1 className="text-4xl font-PoppinsMedium block whitespace-nowrap text-center">
                        Join as a
                    </h1>
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4 w-full my-4">
                        <Link to={"/client-register"} className="w-full text-center shadow border border-gray-200 focus:border-primary-0 focus:bg-slate-50 p-8 rounded-lg">
                            <FontAwesomeIcon icon={faUser} className="text-xl" />
                            <h1 className="text-xl font-PoppinsMedium">Client</h1>
                        </Link>
                        <Link to={"/maid-register"} className="w-full text-center shadow border border-gray-200 focus:border-primary-0 focus:bg-slate-50 p-8 rounded-lg">
                            <FontAwesomeIcon icon={faBriefcase} className="text-xl" />
                            <h1 className="text-xl font-PoppinsMedium">Maid</h1>
                        </Link>
                    </div>
                    <div className="font-PoppinsRegular text-xs text-center mt-6">
                        Have an account ? &nbsp;
                        <Link to={'/'} className="text-primary-0">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
  )
}
