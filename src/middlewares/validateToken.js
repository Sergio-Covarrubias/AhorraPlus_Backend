import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const authRequired = (req, res, next) => {
    //console.log('req.cookies:', req.cookies);
    //console.log('req.headers.cookie:', req.headers.cookie)
    //const { token } = req.cookies;
    
    //console.log(req.query.token);
    const token = req.query.token;
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        
        req.user = user;
        next();
    });
};
