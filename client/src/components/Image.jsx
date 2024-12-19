import { IKImage } from 'imagekitio-react';

const Image = ({ path, className, w, h, alt, src }) => {

    return (
        <IKImage
            urlEndpoint={import.meta.env.VITE_IK_URL}
            path={path}
            className={className}
            loading="lazy"
            lqip={{ active: true, quality: 20 }}
            width={w}
            height={h}
            alt={alt}
            src={src}
            transformation={[
                {
                    width: w,
                    height: h,
                },
            ]}
        />
    );
};

export default Image;