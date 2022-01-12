/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from 'express';
import * as dotenv from 'dotenv';
import {connect} from '../../db/service';
import License from '../../db/models/license';
import {Sequelize} from 'sequelize';
import {failError, failValidation} from './baseRouter';
import Joi from 'joi';

dotenv.config();

/**
 * Router Definition
 */
export const licensesRouter = express.Router();

/**
 * Controller Definitions
 */

// GET all
licensesRouter.get('/', async (req: Request, res: Response) => {

    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        failError(res);
    } else {
        License(sequelize).findAll()
            .then(rows => res.json(rows))
            .catch(err => failError(res, err));
    }
});

// GET uuid
licensesRouter.get('/:uuid', async (req: Request, res: Response) => {

    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const uuid: string = req.params.uuid;

    const schema: Joi.AnySchema = Joi
        .string()
        .guid({version: 'uuidv4'})
        .required();
    const {error}: any = schema.validate(uuid);
    if (error != null) {
        return failValidation(res, error);
    }

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        failError(res);
    } else {
        License(sequelize).findOne({where: {licenseUuid: uuid}})
            .then(rows => res.json(rows))
            .catch(err => failError(res, err));
    }
});

// POST create
licensesRouter.post('/', async (req: Request, res: Response) => {

    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    let params: object = {
        type: req.body.type != null ? req.body.type : 'FREE', // #TODO the 'FREE' part could cause trouble!
        reference: req.body.type,
        domain: req.body.domain,
        teamName: req.body.teamName,
        active: req.body.active === 'true',
    };

    const schema: Joi.AnySchema = Joi
        .object({
            type: Joi
                .string()
                .allow('FREE') // #TODO use enum instead of literals for all license type-related!
                .required(),

            reference: Joi
                .string()
                .max(64)
                .pattern(/^[a-zA-Z0-9_-]+$/i)
                .optional(),

            domain: Joi
                .string()
                .max(50)
                .optional(),

            teamName: Joi
                .string()
                .max(25)
                .required(),

            active: Joi
                .boolean()
                .optional(),
        });
    const {error}: any = schema.validate(params, {abortEarly: false});
    if (error != null) {
        return failValidation(res, error);
    }

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        failError(res);
    } else {
        // @js-ignore
        // @ts-ignore
        License(sequelize).create(params)
            .then(rows => res.status(201).json(rows))
            .catch(err => failError(res, err));
    }
});

// PUT uuid update
licensesRouter.put('/:uuid', async (req: Request, res: Response) => {

    // #TODO check if license has perms to do all this!
    // #TODO add auth, this function is only limited to ADMINS

    const uuid: string = req.params.uuid;

    const schema0: Joi.AnySchema = Joi
        .string()
        .guid({version: 'uuidv4'})
        .required();
    let error: any = schema0.validate(uuid).error;
    if (error != null) {
        return failValidation(res, error);
    }

    // #TODO prevent end users from changing anything about their license except team name and domain!

    let params: any = {};
    if (req.body.type != null) params.type = req.body.type;
    if (req.body.reference != null) params.reference = req.body.reference;
    if (req.body.domain != null) params.domain = req.body.domain;
    if (req.body.teamName != null) params.teamName = req.body.teamName;
    if (req.body.active != null) params.active = req.body.active === 'true';

    const schema1 = Joi
        .object({
            type: Joi
                .string()
                .allow('FREE') // #TODO use enum instead of literals for all license type-related!
                .optional(),

            reference: Joi
                .string()
                .max(64)
                .pattern(/^[a-zA-Z0-9_-]+$/i)
                .optional(),

            domain: Joi
                .string()
                .max(50)
                .optional(),

            teamName: Joi
                .string()
                .max(25)
                .optional(),

            active: Joi
                .boolean()
                .optional(),
        });
    error = schema1.validate(params, {abortEarly: false});
    if (error != null) {
        return failValidation(res, error);
    }

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        failError(res);
    } else {
        License(sequelize).update(params, {where: {licenseUuid: uuid}})
            .then(rows => res.status(204).send('Updated'))
            .catch(err => failError(res, err));
    }
});

// DELETE uuid delete
licensesRouter.delete('/:uuid', async (req: Request, res: Response) => {

    // #TODO check if license has perms to do all this!
    // #TODO add auth, this function is only limited to ADMINS

    const uuid: string = req.params.uuid;

    const schema: Joi.AnySchema = Joi
        .string()
        .guid({version: 'uuidv4'})
        .required();
    const {error}: any = schema.validate(uuid);
    if (error != null) {
        return failValidation(res, error);
    }

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        failError(res);
    } else {
        License(sequelize).destroy({where: {licenseUuid: uuid}})
            .then(rows => res.status(200).send('Deleted'))
            .catch(err => failError(res, err));
    }
});