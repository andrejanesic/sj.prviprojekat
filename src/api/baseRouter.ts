import {Response} from 'express';
import log from '../logger/service';
import {ValidationError} from 'sequelize';

/**
 * Helper function for handling errors.
 * @param res Response object.
 * @param e Error or any printable object.
 */
export default function error(res: Response, e?: any): void {
    if (e != null) log(e);
    if (e instanceof ValidationError) {
        res
            .status(400)
            .send('Bad input.');
    } else {
        res
            .status(500)
            .send('Failed to execute request.');
    }
}