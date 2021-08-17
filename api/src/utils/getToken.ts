import jwt from 'jsonwebtoken';

export const getToken = (): string => {
    const payload = {
        iss: process.env.API_KEY,
        exp: ( ( new Date() ).getTime() + 5000 )
    };

    return jwt.sign(payload, process.env.API_SECRET);
};
