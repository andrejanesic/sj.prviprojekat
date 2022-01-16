import {Request} from 'express';
import jwt from 'jsonwebtoken';
import {env} from './env';
import {AuthPayload} from '../middleware/authentication';

/**
 * Checks whether the user is authorized.
 * @param req Request.
 */
export function authorized(req: Request): AuthPayload | null {
    // fetch token
    let token: string | null = req.headers.authorization ?? null;
    if (!token) {
        let gr: RegExpMatchArray | null | undefined = req.headers.cookie?.match(/token=([^;]+)/);
        if (gr) {
            token = gr[1];
        }
    }
    if (!token) {
        token = req.body.token;
    }
    if (!token) return null;

    try {
        return jwt.verify(token, env('JWT_SECRET')) as AuthPayload;
    } catch (e) {
        return null;
    }
}