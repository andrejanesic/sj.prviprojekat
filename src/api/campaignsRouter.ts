/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from 'express';
import * as dotenv from 'dotenv';
import {connect} from '../db/service';
import {Sequelize} from 'sequelize';
import {failError, failValidation} from './baseRouter';
import Campaign from '../db/models/campaign';
import Joi from 'joi';

dotenv.config();

/**
 * Router Definition
 */
export const campaignsRouter = express.Router();

/**
 * Controller Definitions
 */

// GET all
campaignsRouter.get('/', async (req: Request, res: Response) => {

    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        failError(res, 'Sequelize is null!');
    } else {
        Campaign(sequelize).findAll()
            .then(rows => res.json(rows))
            .catch(err => failError(res, err));
    }
});

// GET uuid
campaignsRouter.get('/:uuid', async (req: Request, res: Response) => {

    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const uuid: string = req.params.uuid;

    const schema: Joi.AnySchema = Joi
        .string()
        .guid({version: 'uuidv4'})
        .required();
    const {error}: any = schema.validate(uuid, {abortEarly: false});
    if (error != null) {
        return failValidation(res, error);
    }

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        failError(res);
    } else {
        Campaign(sequelize).findOne({where: {campaignUuid: uuid}})
            .then(rows => res.json(rows))
            .catch(err => failError(res, err));
    }
});

// POST create
campaignsRouter.post('/', async (req: Request, res: Response) => {

    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    // #TODO add support for variables!

    let params: any = {
        licenseId: parseInt(req.body.licenseId, 10),
        name: req.body.name,
        description: req.body.description,
        color: req.body.color,
        icon: req.body.icon,
    };

    const schema: Joi.AnySchema = Joi
        .object({
            name: Joi
                .string()
                .max(40)
                .required(),

            description: Joi
                .string()
                .max(200)
                .optional(),

            color: Joi
                .string()
                .max(7)
                .optional(),

            icon: Joi
                .string()
                .max(15)
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
        // #TODO fetch licenseId from user data if not backoffice!

        // @ts-ignore
        Campaign(sequelize).create(params)
            .then(rows => res.status(201).json(rows))
            .catch(err => failError(res, err));
    }
});

// PUT uuid update
campaignsRouter.put('/:uuid', async (req: Request, res: Response) => {

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

    // #TODO add support for variables!

    let params: any = {};
    if (req.body.licenseId != null) params.licenseId = parseInt(req.body.licenseId, 10);
    if (req.body.name != null) params.name = req.body.name;
    if (req.body.description != null) params.description = req.body.description;
    if (req.body.color != null) params.color = req.body.color;
    if (req.body.icon != null) params.icon = req.body.icon;

    const schema1 = Joi
        .object({
            name: Joi
                .string()
                .max(40)
                .optional(),

            description: Joi
                .string()
                .max(200)
                .optional(),

            color: Joi
                .string()
                .max(7)
                .optional(),

            icon: Joi
                .string()
                .max(15)
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
        // #TODO fetch licenseId from user data if not backoffice!

        Campaign(sequelize).update(params, {where: {campaignUuid: uuid}})
            .then(rows => res.status(204).send('Updated'))
            .catch(err => failError(res, err));
    }
});

// DELETE uuid delete
campaignsRouter.delete('/:uuid', async (req: Request, res: Response) => {

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
        Campaign(sequelize).destroy({where: {campaignUuid: uuid}})
            .then(rows => res.status(200).send('Deleted'))
            .catch(err => failError(res, err));
    }
});