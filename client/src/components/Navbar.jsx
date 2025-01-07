import { useContext, useState } from "react";
import Image from "./Image";
import { Link } from "react-router-dom";
import { TiThMenu } from "react-icons/ti";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../firebase.js";
import { FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";
import HomeSearch from "./HomeSearch.jsx";
import { AppContext } from "../context/AppContext.jsx";

const Navbar = () => {
    const { openMenu, setOpenMenu } = useContext(AppContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);

    const handleLogout = () => {
        dispatch(logOut()); // Dispatch logout action
        toast.info('Logged out');
        setDropdownOpen(false); // Close dropdown after logout
    };

    return (
        <nav className="w-full h-16 md:h-20 flex justify-between items-center z-[49] sticky top-0 bg-[#e6e6ff]">
            <Link to="/" className="flex items-center gap-4 text-2xl font-bold">
                <Image
                    path="/logo.png"
                    className=""
                    w={32}
                    h={32}
                    alt="Elvislog"
                />
                <span>Elvislog</span>
            </Link>

            {/* Mobile menu */}
            <div className="md:hidden">
                <div className="cursor-pointer text-2xl" onClick={() => setOpenMenu(prev => !prev)}>
                    {openMenu ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="black" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <TiThMenu className="text-2xl" />
                    )}
                </div>

                <div className={`w-full z-50 h-screen flex flex-col items-center justify-center absolute top-16 ${openMenu ? 'right-0' : 'right-[100%]'} transition-all ease-in-out bg-[#e6e6ff] gap-8 font-medium text-lg`}>

                    <HomeSearch />

                    <Link to="/" onClick={() => setOpenMenu(prev => !prev)}>Home</Link>
                    <Link to="/write" onClick={() => setOpenMenu(prev => !prev)}>Write a story</Link>
                    <Link to="/posts" onClick={() => setOpenMenu(prev => !prev)}>Posts</Link>
                    <Link to={`/posts?sort=trending`} onClick={() => setOpenMenu(prev => !prev)}>Trending</Link>
                    <Link to={`/posts?sort=popular`} onClick={() => setOpenMenu(prev => !prev)}>Most Popular</Link>
                    <Link to="/about" onClick={() => setOpenMenu(prev => !prev)}>About</Link>

                    {!user ? (
                        <Link to="/login" onClick={() => setOpenMenu(prev => !prev)}>
                            <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">Login 👋</button>
                        </Link>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <img src={user.img} alt="User" className="w-8 h-8 rounded-full" />
                            <button onClick={handleLogout} className="py-2 px-4 rounded-3xl bg-red-600 text-white">Logout</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
                <Link to="/">Home</Link>
                <Link to="/posts">Posts</Link>
                <Link to={`/posts?sort=trending`}>Trending</Link>
                <Link to={`/posts?sort=popular`}>Most Popular</Link>
                <Link to="/about">About</Link>

                {!user ? (
                    <Link to="/login">
                        <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">Login 👋</button>
                    </Link>
                ) : (
                    <div className="relative">
                        <Image
                            src={user.img}
                            alt="User"
                            className="w-8 h-8 rounded-full cursor-pointer"
                            onClick={() => setDropdownOpen(prev => !prev)}
                        />
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md py-2 z-10">
                                <Link to="/profile">
                                    <p
                                        onClick={() => setDropdownOpen(false)}
                                        className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                                    >
                                        @  {user.username}
                                    </p>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    <FiLogOut className="inline mr-2" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;