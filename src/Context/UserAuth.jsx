import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    browserLocalPersistence, 
    setPersistence, 
    sendPasswordResetEmail, 
    confirmPasswordReset 
} from "firebase/auth"
import { auth } from "@/FirebaseConfig";

const UserAuthContext = createContext()

export const UserAuthContextProvider = ({ children }) => {

    const [user, setUser] = useState({})

    const signIn = async (email, password) => {
        return await signInWithEmailAndPassword(auth, email, password)
    }

    const forgetPassword = async (email) => {
        return await sendPasswordResetEmail(auth, email)
    }

    const resetPassword = async (password) => {
        return await confirmPasswordReset(oobCode, password)
    }

    const logOut = async () => {
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setPersistence(auth, browserLocalPersistence)
            setUser(currentUser)
        })
        return () => {
            unsubscribe()
        }
    }, [])

    return( 
        <UserAuthContext.Provider value={{ user, signIn, logOut, forgetPassword, resetPassword }}>
            {children}
        </UserAuthContext.Provider>
    )
}

export function UseUserAuth(){
    return useContext(UserAuthContext)
}
