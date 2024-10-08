import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js'; 
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const register = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        const userFound = await User.findOne({ email });
        if (userFound) return res.status(400).json(['The email is already in use']);

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password : passwordHash,
        });
        const userSaved = await newUser.save();
        const token = await createAccessToken({ iD: userSaved._id });

        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt,
            token: token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userFound = await User.findOne({ email });
        if (!userFound) return res.status(500).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) return res.status(500).json({ message: 'Incorrect password' });
        
        const token = await createAccessToken({ iD: userFound._id });
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
            token: token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    res.cookie('token', '', {
        expires: new Date(0)
    });
    return res.sendStatus(200);
};

export const profile = async (req, res) => {
    const userFound = await User.findById(req.user.iD);
    if (!userFound) return res.status(400).json({ message: 'User not found' });

    return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt,
    });
};

export const verifyToken = async(req, res) => {
    const token = req.query.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(401).json({ message: 'Unathorized' });

        const userFound = await User.findById(user.iD);
        if (!userFound) return res.status(401).json({ message: 'Unathorized' });

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
        });
    });
};

export const reloadBackend = async(req, res) => {
    console.log('Render server reloaded');
    setTimeout(async () => {
        const res = await fetch(process.env.FRONT_END_URL);
        console.log('Render frontend reloaded');
    }, []);
    res.status(200);
    res.send();
};
