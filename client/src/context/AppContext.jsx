import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppProvider = ({ children }) => {

    const backendUrl = useState(import.meta.env.VITE_BACKEND_URL);

    const [token, setToken] = useState(
        localStorage.getItem("token") || ""
    );
    const [userData, setUserData] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    const loadUserProfile = async () => {
        try {
            setUserLoading(true);
            const { data } = await axios.get(`${backendUrl}/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (data.success) {
                setUserData(data.user);
            } else {
                //toast.error(data.message);
            }
        } catch (error) {
            console.log(error.message);
            //toast.error(error.message);
        } finally {
            setUserLoading(false);
        }
    };

    function formatTimeAgo(createdAt) {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const seconds = Math.floor((now - createdDate) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1,
        };

        for (const [unit, value] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / value);
            if (interval >= 1) {
                return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
            }
        }

        return "just now";
    };

    const handleShareToPlatform = (platform, post) => {
        const { title, slug, _id: postId } = post;
        const postUrl = `https://elvisblog.onrender.com/${slug}`;
        const text = encodeURIComponent(`Check out this post: ${title} - ${postUrl}`);
        let shareUrl = "";

        switch (platform) {
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?text=${text}`;
                break;
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`;
                break;
            case "whatsapp":
                shareUrl = `https://wa.me/?text=${text}`;
                break;
            case "instagram":
                alert("Instagram sharing needs to be done through the app.");
                return; // Instagram sharing is limited through web
            default:
                console.error("Unsupported platform");
                return;
        }

        try {
            const res = axios.patch(`${backendUrl}/posts/share`, { postId });
            if (res.status === 200) {
                console.log(res);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error(error.response?.data || error.message);
        }

        // Open the share URL in a new tab
        window.open(shareUrl, "_blank");
    };

    const value = {
        formatTimeAgo,
        handleShareToPlatform,
        loadUserProfile,
        token,
        setToken,
        userData,
        userLoading,
        backendUrl,
        openMenu,
        setOpenMenu,
    };

    useEffect(() => {
        if (token) {
            loadUserProfile();
        } else {
            setUserData(false);
        }
    }, []);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;