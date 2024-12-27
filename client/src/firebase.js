// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { clearUser, setUser } from "./userSlice";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "elvislog-fff8e.firebaseapp.com",
    projectId: "elvislog-fff8e",
    storageBucket: "elvislog-fff8e.firebasestorage.app",
    messagingSenderId: "464812056311",
    appId: "1:464812056311:web:692d571fc79951c4f4bdf2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
    return async (dispatch) => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            dispatch(setUser(user));
        } catch (error) {
            console.error("Error signing in with Google: ", error);
        }
    }
};

export const logOut = () => {
    return async (dispatch) => {
        try {
            await signOut(auth);
            dispatch(clearUser());
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };
};

export { app, provider, auth };