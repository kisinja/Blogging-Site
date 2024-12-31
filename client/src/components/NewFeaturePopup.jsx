import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const NewFeaturePopup = () => {

    const [showPopup, setShowPopup] = useState(false);
    const user = useSelector(state => state.auth.user);

    useEffect(() => {
        const isFeatureSeen = localStorage.getItem('newFeatureSeen');
        if (!isFeatureSeen && user?.role === 'user') {
            setShowPopup(true);
        }
    }, [user]);

    const handleClose = () => {
        localStorage.setItem('newFeatureSeen', true);
        setShowPopup(false);
    };

    if (!showPopup) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                <h2 className="text-lg font-bold">New Feature Alert!!</h2>
                <p className="mt-2 text-gray-600">
                    We{"’"}ve added an AI content generation feature to help you create amazing posts faster. Try it out now!
                </p>

                <button
                    onClick={handleClose}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                >
                    Got it!
                </button>
            </div>
        </div>
    );
};

export default NewFeaturePopup;