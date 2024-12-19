import axios from 'axios';
import { toast } from 'react-toastify';
import { IKContext, IKUpload } from 'imagekitio-react';
import { useRef } from 'react';

const authenticator = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/posts/upload-auth`);

        if (res.status !== 200) {
            throw new Error(`Request failed with status: ${res.status}`);
        }

        const { signature, expire, token } = res.data;

        return { signature, expire, token };
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || "An error occurred");
    }
};

const Upload = ({ setData, setProgress, children, type }) => {

    const ref = useRef(null);

    const onError = (err) => {
        console.log(err);
        toast.error('Image upload failed!');
    };

    const onSuccess = (res) => {
        console.log(res);
        setData(res.url);
    };

    const onUploadProgress = (progress) => {
        setProgress(Math.round((progress.loaded / progress.total) * 100));
    };

    return (
        <IKContext
            publicKey="public_55qUsE/ezrLLUf90TsOw3bbMPpY="
            urlEndpoint="https://ik.imagekit.io/kisinjakit"
            authenticator={authenticator}
        >
            <IKUpload
                useUniqueFileName
                onError={onError}
                onSuccess={onSuccess}
                onUploadProgress={onUploadProgress}
                className='hidden'
                ref={ref}
                accept={`${type}/*`}
            />
            <div onClick={() => ref.current.click()} className="cursor-pointer">
                {children}
            </div>
        </IKContext>
    );
};

export default Upload;