import {Response} from 'express';
import log from '../logger/service';
import {ValidationError} from 'sequelize';
import Joi from 'joi';

/**
 * Helper function for handling validation fails.
 * @param res Response object.
 * @param err Validation error. Optional.
 */
export function failValidation(res: Response, err?: Joi.ValidationError): void {
    // #TODO localize output
    // #TODO consider sending an array of field names that have errors instead of raw output
    res.status(400).send(err != null ? err.message : 'Bad input.');
}

/**
 * Helper function for handling errors.
 * @param res Response object.
 * @param e Error or any printable object.
 */
export function failError(res: Response, e?: any): void {
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