/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from 'express';
import * as dotenv from 'dotenv';
import {connect} from '../../db/service';
import {Sequelize} from 'sequelize';
import {failError, failValidation} from './baseRouter';
import Funnel from '../../db/models/funnel';
import Joi from 'joi';

dotenv.config();

/**
 * Router Definition
 */
export const funnelsRouter = express.Router();

/**
 * Controller Definitions
 */

// GET all
funnelsRouter.get('/', async (req: Request, res: Response) => {

    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        failError(res, 'Sequelize is null!');
    } else {
        Funnel(sequelize).findAll()
            .then(rows => res.json(rows))
            .catch(err => failError(res, err));
    }
});

// GET uuid
funnelsRouter.get('/:uuid', async (req: Request, res: Response) => {

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
        Funnel(sequelize).findOne({where: {funnelUuid: uuid}})
            .then(rows => res.json(rows))
            .catch(err => failError(res, err));
    }
});

// POST create
funnelsRouter.post('/', async (req: Request, res: Response) => {

    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    // #TODO add support for content and variables!

    let params: any = {
        campaignUuid: req.body.campaignUuid,
        name: req.body.description,
        isTemplate: req.body.isTemplate === 'true',
        description: req.body.description,
        type: req.body.type,
    };

    const schema: Joi.AnySchema = Joi
        .object({
            campaignUuid: Joi
                .string()
                .guid({version: 'uuidv4'})
                .required(),

            name: Joi
                .string()
                .max(60)
                .optional(),

            isTemplate: Joi
                .boolean()
                .required(),

            type: Joi
                .string()
                .max(30)
                .optional(),

            description: Joi
                .string()
                .max(200)
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
        Funnel(sequelize).create(params)
            .then(rows => res.status(201).json(rows))
            .catch(err => failError(res, err));
    }
});

// PUT uuid update
funnelsRouter.put('/:uuid', async (req: Request, res: Response) => {

    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const uuid: string = req.params.uuid;

    const schema0: Joi.AnySchema = Joi
        .string()
        .guid({version: 'uuidv4'})
        .required();
    let error: any = schema0.validate(uuid).error;
    if (error != null) {
        return failValidation(res, error);
    }

    // #TODO add support for content and variables!

    let params: any = {};
    if (req.body.campaignUuid != null) params.campaignUuid = req.body.campaignUuid;
    if (req.body.name != null) params.name = req.body.name;
    if (req.body.isTemplate != null) params.isTemplate = req.body.isTemplate === 'true';
    if (req.body.type != null) params.type = req.body.type;
    if (req.body.description != null) params.description = req.body.description;

    const schema1 = Joi
        .object({
            campaignUuid: Joi
                .string()
                .guid({version: 'uuidv4'})
                .optional(),

            name: Joi
                .string()
                .max(60)
                .optional(),

            isTemplate: Joi
                .boolean()
                .optional(),

            type: Joi
                .string()
                .max(30)
                .optional(),

            description: Joi
                .string()
                .max(200)
                .optional(),
        });
    error = schema1.validate(params, {abortEarly: false}).error;
    if (error != null) {
        return failValidation(res, error);
    }

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        failError(res);
    } else {
        // #TODO add support for content and variables!

        Funnel(sequelize).update(params, {where: {funnelUuid: uuid}})
            .then(rows => res.status(204).send('Updated'))
            .catch(err => failError(res, err));
    }
});

// DELETE uuid delete
funnelsRouter.delete('/:uuid', async (req: Request, res: Response) => {

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
        Funnel(sequelize).destroy({where: {funnelUuid: uuid}})
            .then(rows => res.status(200).send('Deleted'))
            .catch(err => failError(res, err));
    }
});