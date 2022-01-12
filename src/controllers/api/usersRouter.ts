/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from 'express';
import * as dotenv from 'dotenv';
import {connect} from '../../db/service';
import User from '../../db/models/user';
import {Sequelize} from 'sequelize';
import License from '../../db/models/license';
import {failError, failValidation} from './baseRouter';
import Joi from 'joi';

dotenv.config();

/**
 * Router Definition
 */
export const usersRouter = express.Router();

/**
 * Controller Definitions
 */

// GET all
usersRouter.get('/', async (req: Request, res: Response) => {

    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        failError(res, 'Sequelize is null!');
    } else {
        User(sequelize).findAll()
            .then(rows => res.json(rows))
            .catch(err => failError(res, err));
    }
});

// GET uuid
usersRouter.get('/:uuid', async (req: Request, res: Response) => {

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
        User(sequelize).findOne({where: {userUuid: uuid}})
            .then(rows => res.json(rows))
            .catch(err => failError(res, err));
    }
});

// POST create
usersRouter.post('/', async (req: Request, res: Response) => {

    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    let params: any = {
        bio: req.body.bio,
        email: req.body.email,
        firstName: req.body.firstName,
        isAdminBilling: req.body.isAdminBilling === 'true',
        isAdminMaster: req.body.isAdminMaster === 'true',
        lastName: req.body.lastName,
        licenseUuid: req.body.licenseUuid,
        password: req.body.password,
        role: req.body.role,
    };
    console.log(req.body);

    const schema: Joi.AnySchema = Joi
        .object({
            bio: Joi
                .string()
                .max(200)
                .optional(),

            email: Joi
                .string()
                .email()
                .required(),

            firstName: Joi
                .string()
                .max(30)
                .regex(/^[\p{L}'\- ]+$/iu)
                .optional(),

            isAdminBilling: Joi
                .boolean()
                .required(),

            isAdminMaster: Joi
                .boolean()
                .required(),

            lastName: Joi
                .string()
                .max(30)
                .regex(/^[\p{L}'\- ]+$/iu)
                .optional(),

            licenseUuid: Joi
                .string()
                .guid({version: 'uuidv4'})
                .optional(),

            password: Joi
                .string()
                .min(8)
                .max(30)
                .required(),

            role: Joi
                .string()
                .max(80)
                .optional(),
        });
    const {error}: any = schema.validate(params);
    if (error != null) {
        return failValidation(res, error);
    }

    // #TODO hash password here!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        failError(res);
    } else {
        // if new team (set licenseUuid = null) then make a new license
        if (params.licenseUuid == null) {
            // @js-ignore
            // @ts-ignore
            License(sequelize).create({
                // #TODO what string is before '@', is it dangerous?
                teamName: params.email.toString().split('@')[0] + '\'s Team',
                type: 'FREE'
            })
                .then((value) => {
                    params.licenseUuid = value.licenseUuid;
                    params.isAdminMaster = true;
                    params.isAdminBilling = true;

                    // @js-ignore
                    User(sequelize).create(params)
                        .then(rows => res.json(rows))
                        .catch(err => failError(res, err));
                })
                .catch(err => failError(res, err));
        } else {
            // #TODO set licenseUuid here since user is being added to existing team!

            // @js-ignore
            User(sequelize).create(params)
                .then(rows => res.status(201).json(rows))
                .catch(err => failError(res, err));
        }
    }
});

// PUT uuid update
usersRouter.put('/:uuid', async (req: Request, res: Response) => {

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

    let params: any = {};
    if (req.body.bio != null) params.bio = req.body.bio;
    if (req.body.email != null) params.email = req.body.email;
    if (req.body.firstName != null) params.firstName = req.body.firstName;
    if (req.body.isAdminBilling != null) params.isAdminBilling = req.body.isAdminBilling === 'true';
    if (req.body.isAdminMaster != null) params.isAdminMaster = req.body.isAdminMaster === 'true';
    if (req.body.lastName != null) params.lastName = req.body.lastName;
    if (req.body.licenseUuid != null) params.licenseUuid = req.body.licenseUuid; // #TODO only allow backoffice to edit this!
    if (req.body.password != null) params.password = req.body.password;
    if (req.body.role != null) params.role = req.body.role;

    const schema1: Joi.AnySchema = Joi
        .object({
            bio: Joi
                .string()
                .max(200)
                .optional(),

            email: Joi
                .string()
                .email()
                .optional(),

            firstName: Joi
                .string()
                .max(30)
                .regex(/^[\p{L}'\- ]+$/iu)
                .optional(),

            isAdminBilling: Joi
                .boolean()
                .optional(),

            isAdminMaster: Joi
                .boolean()
                .optional(),

            lastName: Joi
                .string()
                .max(30)
                .regex(/^[\p{L}'\- ]+$/iu)
                .optional(),

            licenseUuid: Joi
                .string()
                .guid({version: 'uuidv4'})
                .optional(),

            password: Joi
                .string()
                .min(8)
                .max(30)
                .optional(),

            role: Joi
                .string()
                .max(80)
                .optional(),
        });
    error = schema1.validate(params, {abortEarly: false}).error;
    if (error != null) {
        return failValidation(res, error);
    }

    // #TODO hash password here if changed!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        failError(res);
    } else {
        // #TODO prevent end users from transferring themselves into different teams!

        User(sequelize).update(params, {where: {userUuid: uuid}})
            .then(rows => res.status(204).send('Updated'))
            .catch(err => failError(res, err));
    }
});

// DELETE uuid delete
usersRouter.delete('/:uuid', async (req: Request, res: Response) => {

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
        User(sequelize).destroy({where: {userUuid: uuid}})
            .then(rows => res.status(200).send('Deleted'))
            .catch(err => failError(res, err));
    }
});