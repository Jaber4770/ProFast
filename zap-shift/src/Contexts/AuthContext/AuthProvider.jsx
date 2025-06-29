import React, { useEffect, useState } from 'react';
import { auth } from '../../Firebase/firebase.init';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, updateProfile } from "firebase/auth";
import { AuthContext } from './AuthContext';

const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);


    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email,password)
    }

    const logOutUser = () => {
        return signOut(auth);
    }

    const signInWithGooglePopup = () => {
        setLoading(true);
        return signInWithPopup(auth, provider);
    }

    const updateUserPorfile = profileInfo => {
        return updateProfile(auth.currentUser, profileInfo);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            // console.log("user in the state change: ", currentUser);
            setLoading(false);
        })
         return ()=> unsubscribe();
    },[])

    const authInfo = {
        user,
        setUser,
        loading,
        createUser,
        signInUser,
        logOutUser,
        updateUserPorfile,
        signInWithGooglePopup
    }

    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;