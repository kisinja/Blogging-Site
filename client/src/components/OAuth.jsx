import googleIcon from "../../public/google.svg";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { app } from "../firebase.js";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../userSlice.js";

const OAuth = () => {

    const auth = getAuth(app);
    const dispatch = useDispatch();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        // Sign in with Google
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            //console.log(resultsFromGoogle);

            const { data } = await axios.post(`${backendUrl}/auth/google`, {
                username: resultsFromGoogle.user.displayName,
                email: resultsFromGoogle.user.email,
                googlePhotoUrl: resultsFromGoogle.user.photoURL,
            });

            if (data.success) {
                // set token to local storage
                localStorage.setItem("token", data.token);

                // set user
                localStorage.setItem("user", JSON.stringify(data.user));

                // set user to redux store
                dispatch(setUser(data.user));

                toast.success("Logged in successfully");
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error(error);
            toast.error("An error occurred while trying to sign in with Google");
        }
    };

    return (
        <button className="w-full bg-transparent border border-gray-500 text-gray-500 py-2 rounded-full text-base hover:bg-gray-500 hover:text-white transition-all duration-300 ease-in-out" onClick={handleGoogleLogin} type="button">
            <img src={googleIcon} alt="Google" className="w-6 h-6 inline-block mr-2" />
            Continue with Google
        </button>
    );
};

export default OAuth;