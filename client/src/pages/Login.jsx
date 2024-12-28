import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import OAuth from "../components/OAuth";

const Login = () => {

    const [state, setState] = useState('Login');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (state === 'Sign Up') {
                const { data } = await axios.post(`${backendUrl}/auth/register`, { username, email, password });
                if (data.success) {
                    toast.success("Sign up successful!");

                    // set token to local storage
                    localStorage.setItem('token', data.token);

                    // set user
                    localStorage.setItem('user', JSON.stringify(data.user));

                    // reload the page
                    window.location.reload();
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(`${backendUrl}/auth/login`, { email, password });
                if (data.success) {
                    toast.success("Login successful!");

                    // set token to local storage
                    localStorage.setItem('token', data.token);

                    // set user
                    localStorage.setItem('user', JSON.stringify(data.user));

                    // reload the page
                    window.location.reload();
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="min-h-[80vh] flex items-center" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg bg-white">
                <p className="text-2xl font-semibold">{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>

                {
                    state === 'Sign Up' &&
                    <div className="w-full">
                        <label htmlFor="username" className="block">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border rounded-md p-2 placeholder:italic"
                            required
                        />
                    </div>
                }

                <div className="w-full">
                    <label htmlFor="email" className="block">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-md p-2 placeholder:italic"
                        required
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="password" className="block">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-md p-2 placeholder:italic"
                        required
                    />
                </div>

                <button type="submit" className="bg-blue-800 text-white w-full py-2 rounded-md text-base" disabled={loading}>
                    {
                        loading
                            ? 'Loading...'
                            : state === 'Sign Up'
                                ? 'Sign Up'
                                : 'Login'
                    }
                </button>

                <div className="text-sm w-full flex flex-col items-center justify-center">
                    or
                </div>

                <OAuth />

                <div className="w-full mt-3">
                    {
                        state === 'Sign Up'
                            ? <p onClick={() => setState('login')}>Already have an account? <span className="text-blue-800 underline cursor-pointer">Login here</span></p>
                            : <p onClick={() => setState('Sign Up')}>Don&apos;t have an account? <span className="text-blue-800 underline cursor-pointer">Sign up here</span></p>
                    }
                </div>
            </div>

        </form>
    );
};

export default Login;