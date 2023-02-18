import React, { useEffect, useState } from 'react';
import { Header, Footer } from '@/Components';
import { db, auth, storage } from '@/FirebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export const Registration = () => {

    let [ isImage, setIsImage ] = useState(null)

    let [ inputData, setInputData ] = useState({
        firstname: "",
        lastname: "",
        email: "",
        image: "",
        userid: "",
        password: "",
    })

    let imageName =  new Date().getTime()

    const { email, password } = inputData

    const createUsers = async () => {

        try {
            const imageRef = ref(storage, `images/${imageName}`)
            uploadBytes(imageRef, isImage).then((snapshot) => {
                getDownloadURL(snapshot.ref).then( async url => {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                    const user = userCredential.user

                    const inputDataCopy = {...inputData}
                    inputDataCopy.timestamp = serverTimestamp()
                    inputDataCopy.image = url

                    await setDoc(doc(db, 'User', user.uid), inputDataCopy)
                })
            })
        }
        catch (error) {
            console.log("Error")
        }

    }

    function imageFieldsHandler(e) {
        setIsImage(e.target.files[0]);
    }
    
    const [ users, setUsers ] = useState([])
    const userCollect = collection(db, "User")

    useEffect(() => {
        const getUsers = async () => {  
            const data = await getDocs(userCollect)
            setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
        };
        getUsers()
    }, [])

  return (
        <>
            <Header position="static"/>
            
            <div className="h-[80vh] lg:px-20 md:px-12 px-6 flex justify-center items-center trshow">
                {/* <div className="grid grid-cols-12 w-full mb-2 gap-2">
                    <div className="col-span-12 bg-white rounded-md shadow">
                        <div className="h-[8vh] px-4 border-b flex items-center">
                            <h1 className="font-PoppinsRegular text-base">
                                Register Students
                            </h1>
                        </div>
                        <form className="h-[34vh] flex flex-col justify-between overflow-auto w-full cst-scrollbar p-4">
                            <div className="flex gap-4">
                                <input name="firstname" onChange={fieldsHandler} className="font-PoppinsRegular outline-none bg-zinc-100 w-full rounded p-2" placeholder="First Name" type="text" />
                                <input name="lastname" onChange={fieldsHandler} className="font-PoppinsRegular outline-none bg-zinc-100 w-full rounded p-2" placeholder="Last Name" type="text" />
                            </div>
                            <div className="flex gap-4">
                                <input name="email" onChange={fieldsHandler} className="font-PoppinsRegular outline-none bg-zinc-100 w-full rounded p-2" placeholder="Email" type="email" />
                                <label htmlFor="image" className="font-PoppinsRegular outline-none bg-zinc-100 rounded p-2 px-4 flex justify-center">
                                    <img className="w-5" src={Camera}/>
                                </label>
                                <input id="image" name="image" onChange={imageFieldsHandler} type="file" />
                            </div>
                            <div className="flex gap-4">
                                <input name="userid" onChange={fieldsHandler} className="font-PoppinsRegular outline-none bg-zinc-100 w-full rounded p-2" placeholder="User ID" type="text" />
                                <input name="password" onChange={fieldsHandler} className="font-PoppinsRegular outline-none bg-zinc-100 w-full rounded p-2" placeholder="Password" type="password" />
                            </div>
                            <div className="">
                                <button onClick={createUsers} className="font-PoppinsMedium bg-primary-2 text-white w-full rounded p-2 text-center" type="button">Register</button>
                            </div>

                        </form>
                    </div>
                </div> */}
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
