import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const TOKEN_SECRET = process.env.TOKEN_SECRET;

export const createAccessToken = (user) => {
    return new Promise((resolve, reject) => {
        jwt.sign(user, TOKEN_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    });
};
