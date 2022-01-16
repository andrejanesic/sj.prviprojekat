/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from 'express';
import * as dotenv from 'dotenv';
import {connect} from '../../db/service';
import User, {UserAttributes} from '../../models/user';
import {FindOptions, Sequelize} from 'sequelize';
import License, {LicenseAttributes} from '../../models/license';
import {failError, failForbidden, failUnauthorized, failValidation} from '../../helpers/response';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import {AuthPayload, AuthPayloadRequest, isUserOrAdmin} from '../../middleware/authentication';
import jwt from 'jsonwebtoken';
import {env} from '../../helpers/env';
import {authorized} from '../../helpers/authorized';
import {filter} from '../../helpers/filters';

dotenv.config();

/**
 * Router Definition
 */
export const usersRouter = express.Router();

/**
 * Controller Definitions
 */

const filterParams: string[] = ['userId', 'password', 'createdAt', 'updatedAt', 'deletedAt'];

// GET all
usersRouter.get('/', isUserOrAdmin, async (req: Request, res: Response) => {

    // connect
    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        return failError(res, 'Sequelize is null!');
    }
    // set query based on perms
    let options: FindOptions<UserAttributes> = {};

    // @ts-ignore
    let payload : AuthPayload = authorized(req);
    if (payload.auth.type == 'Admin') {
        options = {};
    } else {
        let user: UserAttributes | null = await User(sequelize)
            .findOne({where: {userUuid: payload.auth.uuid}});

        if (!user)
            return failUnauthorized(res);

        options = {where: {licenseUuid: user.licenseUuid}};
    }

    // return
    User(sequelize).findAll(options)
        .then(rows => res.json(filter(
            rows,
            filterParams
        )))
        .catch(err => failError(res, err));
});

// GET uuid
usersRouter.get('/:uuid', isUserOrAdmin, async (req: Request, res: Response) => {

    const uuid: string = req.params.uuid;

    // validate
    const schema: Joi.AnySchema = Joi
        .string()
        .guid({version: 'uuidv4'})
        .required();
    const {error}: any = schema.validate(uuid);
    if (error != null) {
        return failValidation(res, error);
    }

    // connect
    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        return failError(res);
    }
    // set query based on perms
    let options: FindOptions<UserAttributes> = {};

    // @ts-ignore
    let payload : AuthPayload = authorized(req);
    if (payload.auth.type == 'User') {
        options = {where: {userUuid: uuid}};
    } else {
        let user: UserAttributes | null = await User(sequelize)
            .findOne({where: {userUuid: payload.auth.uuid}});

        if (!user)
            return failUnauthorized(res);

        options = {where: {licenseUuid: user.licenseUuid, userUuid: uuid}};
    }

    // return
    User(sequelize).findOne(options)
        .then(rows => res.json(filter(
            rows,
            filterParams
        )))
        .catch(err => failError(res, err));
});

// POST create
usersRouter.post('/', async (req: Request, res: Response) => {

    // check if an admin or a user.
    // if admin > auth.
    // if user > check if auth and has perms. Otherwise, create new acc
    // if not logged in > create new.

    // fetch params
    // @ts-ignore
    let params: UserAttributes = {
        // userId: 0,
        // userUuid: '',
        bio: req.body.bio,
        email: req.body.email,
        firstName: req.body.firstName,
        isAdminBilling: req.body.isAdminBilling === 'true',
        isAdminMaster: req.body.isAdminMaster === 'true',
        lastName: req.body.lastName,
        licenseUuid: req.body.licenseUuid ?? '',
        password: req.body.password,
        role: req.body.role,
    };

    // validate params
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

    // start connection
    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        return failError(res);
    }

    // check if email exists
    if (await User(sequelize).findOne({where: {email: params.email}}))
        return failValidation(res, 'User already registered.');

    // hash password
    if (params.password)
        params.password = bcrypt.hashSync(params.password, 10);

    // if client logged in
    if (authorized(req)) {
        let currUuid = authorized(req)?.auth.uuid;
        let currType = authorized(req)?.auth.type;

        if (currType === 'User') {

            // TODO check if license has enough seats/or start extra billing?

            // existing team, fetch license from db
            let userExisting: UserAttributes | null = await User(sequelize)
                .findOne({where: {userUuid: currUuid}});

            // invalid user
            if (!userExisting) {
                return failValidation(res);
            }

            params.licenseUuid = userExisting.licenseUuid;
        }
    } else {
        // if new user, create new license

        // @ts-ignore
        let license: LicenseAttributes | void = await License(sequelize).create({
            active: true,
            reference: null,
            domain: null,

            // #TODO what string is before '@', is it dangerous?
            teamName: params.email.toString().split('@')[0] + ' Team',
            type: 'FREE'
        });

        params.licenseUuid = license.licenseUuid;
        params.isAdminMaster = true;
        params.isAdminBilling = true;
    }

    // create user
    User(sequelize).create(params)
        .then(user => {
            const payload: AuthPayload = {
                auth: {
                    type: 'User',
                    uuid: user.userUuid
                }
            };

            const token: string = jwt.sign(
                payload,
                env('JWT_SECRET'),
                {
                    expiresIn: '2h'
                }
            );

            res.status(201).json(
                filter(
                    {...user, token: token},
                    filterParams
                )
            );
        })
        .catch(err => failError(res, err));
});

// PUT uuid update
usersRouter.put('/:uuid', isUserOrAdmin, async (req: Request, res: Response) => {

    const uuid: string = req.params.uuid;

    const schema0: Joi.AnySchema = Joi
        .string()
        .guid({version: 'uuidv4'})
        .required();
    let error: any = schema0.validate(uuid).error;
    if (error != null) {
        return failValidation(res, error);
    }

    // @ts-ignore
    let payload : AuthPayload = authorized(req);
    let params: any = {};
    if (req.body.bio != null) params.bio = req.body.bio;
    if (req.body.email != null) params.email = req.body.email;
    if (req.body.firstName != null) params.firstName = req.body.firstName;
    if (req.body.isAdminBilling != null) params.isAdminBilling = req.body.isAdminBilling === 'true';
    if (req.body.isAdminMaster != null) params.isAdminMaster = req.body.isAdminMaster === 'true';
    if (req.body.lastName != null) params.lastName = req.body.lastName;
    if (payload.auth.type == 'Admin')
        if (req.body.licenseUuid != null) params.licenseUuid = req.body.licenseUuid;
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

    // hash password
    params.password = bcrypt.hashSync(params.password, 10);

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        return failError(res);
    }

    // check perms
    if (payload.auth.type == 'Admin') {
        User(sequelize).update(params, {where: {userUuid: uuid}})
            .then(() => res.status(204).send('Updated'))
            .catch(err => failError(res, err));
        return;
    }

    if (payload.auth.uuid != uuid) {
        return failUnauthorized(res);
    }

    User(sequelize).update(params, {where: {userUuid: uuid}})
        .then(() => res.status(204).send('Updated'))
        .catch(err => failError(res, err));
});

// DELETE uuid delete
usersRouter.delete('/:uuid', isUserOrAdmin, async (req: Request, res: Response) => {

    const uuid: string = req.params.uuid;

    // validate
    const schema: Joi.AnySchema = Joi
        .string()
        .guid({version: 'uuidv4'})
        .required();
    const {error}: any = schema.validate(uuid);
    if (error != null) {
        return failValidation(res, error);
    }

    // connect
    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        return failError(res);
    }

    // @ts-ignore
    let payload : AuthPayload = authorized(req);

    // check perms
    if (payload.auth.type == 'Admin') {
        User(sequelize).destroy({where: {userUuid: uuid}})
            .then(() => res.status(200).send('Deleted'))
            .catch(err => failError(res, err));
        return;
    }

    let client: UserAttributes | any = await User(sequelize)
        .findOne({where: {userUuid: payload.auth.uuid}});

    if (!client.isAdminMaster)
        return failForbidden(res);

    let target: UserAttributes | any = await User(sequelize)
        .findOne({where: {userUuid: uuid}});

    if (client.licenseUuid != target.licenseUuid)
        return failForbidden(res);

    User(sequelize)
        .destroy({where: {licenseUuid: client.licenseUuid, userUuid: target.userUuid}})
        .then(() => res.status(200).send('Deleted'))
        .catch(err => failError(res, err));
});