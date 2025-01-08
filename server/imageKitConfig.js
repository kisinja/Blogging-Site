import ImageKit from "imagekit";

const imagekit = new ImageKit({
    urlEndpoint: "https://ik.imagekit.io/kisinjakit",
    publicKey: "public_55qUsE/ezrLLUf90TsOw3bbMPpY=",
    //publicKey: process.env.IK_PUBLIC_KEY,
    privateKey: "private_2B7Jmd02SKHKze2CPC+NSTF/TDI=",
});

export default imagekit;