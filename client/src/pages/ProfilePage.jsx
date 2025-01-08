import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from 'react-toastify';
import Dropzone from 'react-dropzone';
import Image from '../components/Image';
import { updateUser } from "../userSlice";
import Upload from "../components/Upload";

const ProfilePage = () => {

    const user = useSelector(state => state.auth.user);
    const token = localStorage.getItem("token") || null;
    const dispatch = useDispatch();
    const [imgPreview, setImgPreview] = useState(user?.img);
    const [progress, setProgress] = useState(0);
    const [formData, setFormData] = useState({
        username: user?.username,
        email: user?.email,
        bio: user?.bio,
    });

    const handleDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setImgPreview(URL.createObjectURL(file));

        const updatedFormData = new FormData();
        updatedFormData.append('img', file);

        //handleSubmit(updatedFormData);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (imgPreview) {
                formData.img = imgPreview;
            }
            const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/users/updateProfile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (data.success) {
                dispatch(updateUser(data.user));
                localStorage.setItem('user', JSON.stringify(data.user));
                toast.success("Profile updated");
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error("Error updating profile!");
        }
    };

    if (!user) return <div className="">Loading...</div>

    return (
        <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <div className="flex flex-col items-center">
                <Image
                    src={imgPreview || user.img}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover mb-4"
                />
                {/* <Dropzone onDrop={handleDrop} accept="image/*" maxFiles={1}>
                    {({ getRootProps, getInputProps }) => (
                        <div
                            {...getRootProps()}
                            className="p-4 border-2 border-dashed border-gray-400 rounded-md cursor-pointer text-center"
                        >
                            <input {...getInputProps()} />
                            <p>Drag and drop an image, or click to select a file</p>
                        </div>
                    )}
                </Dropzone> */}

                <Upload setData={setImgPreview} setProgress={setProgress} type="image">
                    <button className="p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white w-fit active:scale-95" type='button'>
                        Change photo
                    </button>
                </Upload>

                {progress > 0 && progress < 100 && (
                    <div className="relative w-[200px] md:w-1/2 bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-orange-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-600 font-semibold">
                            Uploading: {progress}%
                        </span>
                    </div>
                )}

            </div>

            <form onSubmit={(e) => e.preventDefault()}>
                <div className="mt-4">
                    <label className="block font-medium">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mt-4">
                    <label className="block font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mt-4">
                    <label className="block font-medium">Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows="3"
                    />
                </div>
                <button
                    onClick={() => handleSubmit()}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;