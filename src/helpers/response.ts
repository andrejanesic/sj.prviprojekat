import {Response} from 'express';
import log from './logger';
import {ValidationError} from 'sequelize';
import Joi from 'joi';

/**
 * Helper function for responding OK.
 * @param res Response object.
 * @param data Data to send, optional.
 */
export function respondOk(res: Response, data?: string) {
    res.status(200).send(data ?? null);
}

/**
 * Helper function for handling validation fail responses.
 * @param res Response object.
 * @param err Validation error. Optional.
 */
export function failValidation(res: Response, err?: Joi.ValidationError | string): void {
    // #TODO localize output
    // #TODO consider sending an array of field names that have errors instead of raw output
    if (err instanceof Joi.ValidationError) {
        let t: string | null = err.message;
        if (t) {
            res.status(400).send(t);
        } else {
            for (let e in err.details) {
                // @ts-ignore
                t += e.message + '. ';
            }
            res.status(400).send(t);
        }
    } else {
        res.status(400).send(err);
    }
}

/**
 * Helper function for handling error responses.
 * @param res Response object.
 * @param e Error or any printable object.
 */
export function failError(res: Response, e?: any): void {
    if (e != null) log(e);
    if (e instanceof ValidationError) {
        res
            .status(400)
            .send('Bad input');
    } else {
        res
            .status(500)
            .send('Failed to execute request');
    }
}

/**
 * Helper function for responding as Unauthorized.
 * @param res Response object.
 * @param message Message, optional.
 */
export function failUnauthorized(res: Response, message: string | null = 'Not authorized') {
    res
        .status(401)
        .send(message);
}

/**
 * Helper function for responding as Forbidden.
 * @param res Response object.
 * @param message Message, optional.
 */
export function failForbidden(res: Response, message: string | null = 'Insufficient permissions') {
    res
        .status(403)
        .send(message);
}