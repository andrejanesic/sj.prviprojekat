/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from 'express';
import * as dotenv from 'dotenv';
import {connect} from '../../db/service';
import {Sequelize} from 'sequelize';
import {failError, failValidation} from '../../helpers/response';
import Admin, {AdminAttributes} from '../../models/admin';
import Joi from 'joi';
import {AuthPayload, isAdmin} from '../../middleware/authentication';
import {hasPermission} from '../../middleware/permissions';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {env} from '../../helpers/env';
import {filter} from '../../helpers/filters';

dotenv.config();

/**
 * Router Definition
 */
export const adminsRouter = express.Router();
adminsRouter.use(isAdmin, hasPermission(Admin, 'Admin', 'adminUuid', 'permManageAdmins'));

/**
 * Controller Definitions
 */

const filterParams: string[] = ['adminId', 'password', 'createdAt', 'updatedAt', 'deletedAt'];

// GET all
adminsRouter.get('/', async (req: Request, res: Response) => {

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        return failError(res, 'Sequelize is null!');
    }

    Admin(sequelize).findAll()
        .then(rows => res.json(filter(
            rows,
            filterParams
        )))
        .catch(err => failError(res, err));
});

// GET uuid
adminsRouter.get('/:uuid', async (req: Request, res: Response) => {

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
        return failError(res);
    }

    Admin(sequelize).findOne({where: {adminUuid: uuid}})
        .then(rows => res.json(filter(
            rows,
            filterParams
        )))
        .catch(err => failError(res, err));
});

// POST create
adminsRouter.post('/', async (req: Request, res: Response) => {

    let params: AdminAttributes = {
        adminId: 0,
        adminUuid: '',
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        employeeId: req.body.employeeId,
        permManageAdmins: req.body.permManageAdmins === 'true',
    };

    const schema: Joi.AnySchema = Joi
        .object({
            email: Joi
                .string()
                .email()
                .required(),

            password: Joi
                .string()
                .min(8)
                .max(30)
                .required(),

            permManageAdmins: Joi
                .boolean()
                .required(),

            firstName: Joi
                .string()
                .max(30)
                .regex(/^[\p{L}'\- ]+$/iu)
                .optional(),

            lastName: Joi
                .string()
                .max(30)
                .regex(/^[\p{L}'\- ]+$/iu)
                .optional(),

            employeeId: Joi
                .string()
                .max(30)
                .optional(),
        });
    const {error}: any = schema.validate(params, {abortEarly: false});
    if (error != null) {
        return failValidation(res, error);
    }

    // hash password
    params.password = bcrypt.hashSync(params.password, 10);

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        return failError(res);
    }

    Admin(sequelize).create(params)
        .then(admin => {
            const payload: AuthPayload = {
                auth: {
                    type: 'Admin',
                    uuid: admin.adminUuid
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
                    {...admin, token: token},
                    filterParams
                )
            );
        })
        .catch(err => failError(res, err));
});

// PUT uuid update
adminsRouter.put('/:uuid', async (req: Request, res: Response) => {

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
    if (req.body.adminUuid != null) params.adminUuid = req.body.adminUuid;
    if (req.body.firstName != null) params.firstName = req.body.firstName;
    if (req.body.lastName != null) params.lastName = req.body.lastName;
    if (req.body.password != null) params.password = req.body.password;
    if (req.body.permManageAdmins != null) params.permManageAdmins = req.body.permManageAdmins === 'true';
    if (req.body.employeeId != null) params.employeeId = req.body.employeeId;

    const schema1 = Joi
        .object({
            adminUuid: Joi
                .string()
                .guid({version: 'uuidv4'})
                .optional(),

            email: Joi
                .string()
                .email()
                .optional(),

            password: Joi
                .string()
                .min(8)
                .max(30)
                .optional(),

            permManageAdmins: Joi
                .boolean()
                .optional(),

            firstName: Joi
                .string()
                .max(30)
                .regex(/^[\p{L}'\- ]+$/iu)
                .optional(),

            lastName: Joi
                .string()
                .max(30)
                .regex(/^[\p{L}'\- ]+$/iu)
                .optional(),

            employeeId: Joi
                .string()
                .max(30)
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

    Admin(sequelize).update(params, {where: {adminUuid: uuid}})
        .then(() => res.status(204).send('Updated'))
        .catch(err => failError(res, err));
});

// DELETE uuid delete
adminsRouter.delete('/:uuid', async (req: Request, res: Response) => {

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
        return failError(res);
    }

    Admin(sequelize).destroy({where: {adminUuid: uuid}})
        .then(() => res.status(200).send('Deleted'))
        .catch(err => failError(res, err));
});