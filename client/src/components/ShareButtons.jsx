import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { GrInstagram } from "react-icons/gr";

const ShareButtons = ({ post }) => {

    const { handleShareToPlatform } = useContext(AppContext);

    return (
        <div className="flex md:items-center md:gap-8 sm:flex-col md:flex-row gap-4">
            <h1 className="text-lg md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
                Share this post:
            </h1>

            <div className="flex gap-4">
                <button
                    className="bg-black text-white rounded-full w-10 h-10 flex justify-center items-center hover:translate-y-1 duration-400 transition-all"
                    onClick={() => handleShareToPlatform("twitter", post)}
                >
                    <FaSquareXTwitter title="Share to X" size={24} />
                </button>
                <button
                    className="bg-blue-600 text-white  rounded-full w-10 h-10 flex justify-center items-center hover:translate-y-1 duration-400 transition-all"
                    onClick={() => handleShareToPlatform("facebook", post)}
                >
                    <FaFacebookSquare title="Share to Facebook" size={24} />
                </button>
                <button
                    className="bg-green-500 text-white  rounded-full w-10 h-10 flex justify-center items-center hover:translate-y-1 duration-400 transition-all"
                    onClick={() => handleShareToPlatform("whatsapp", post)}
                >
                    <IoLogoWhatsapp title="Share to WhatsApp" size={24} />
                </button>
                <button
                    className="bg-pink-500 text-white  rounded-full w-10 h-10 flex justify-center items-center hover:translate-y-1 duration-400 transition-all"
                    onClick={() => handleShareToPlatform("instagram", post)}
                >
                    <GrInstagram title="Share to Instagram" size={24} />
                </button>
            </div>
        </div>
    );
};

export default ShareButtons;