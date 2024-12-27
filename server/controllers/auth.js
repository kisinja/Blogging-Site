import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const generateToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return token;
};

// Register
const register = async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required to create an acoount!!", success: false });
    }

    try {
        // check if user exists
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists. Please Login !!", success: false });
        }

        // check email and password validity
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email!", success: false });
        };

        if (password.length < 8) {
            return res.status(400).json({ message: "Password cannot be less than 8 characters!", success: false });
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ message: "Please enter a strong password!", success: false });
        };

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // save the user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const token = generateToken({ id: newUser._id });

        res.json({ message: "Register Successful", success: true, token, user: newUser });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

// Login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExists = await User.findOne({ email: email });
        if (!userExists) {
            return res.status(400).json({ message: "User does not exist !!", success: false });
        }

        // compare passwords
        const isMatch = await bcrypt.compare(password, userExists.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials !!", success: false });
        }

        const token = generateToken({ id: userExists._id });


        res.json({ user: userExists, success: true, token });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

// Google OAuth controller
const google = async (req, res) => {
    const { username, email, googlePhotoUrl } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            const token = generateToken({ id: userExists._id });
            const { password, ...rest } = userExists._doc;

            return res.status(200).json({ success: true, token, user: rest });
        } else {
            const generatedPassword = Math.round().toString(36).slice(-8) + Math.round().toString(36).slice(-8);

            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

            const newUser = new User({
                username: username.toLowerCase().split(" ").join("") + Math.round().toString(9).slice(-4),
                email,
                password: hashedPassword,
                img: googlePhotoUrl,
            });

            await newUser.save();

            const token = generateToken({ id: newUser._id });

            const { password, ...rest } = newUser._doc;

            res.status(200).json({ success: true, token, user: rest });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

export { register, login, google };