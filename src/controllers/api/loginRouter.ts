/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from 'express';
import * as dotenv from 'dotenv';
import {connect} from '../../db/service';
import {Sequelize} from 'sequelize';
import {failError, failUnauthorized, failValidation} from '../../helpers/response';
import Joi from 'joi';
import User from '../../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {env} from '../../helpers/env';
import {AuthPayload} from '../../middleware/authentication';
import Admin from '../../models/admin';

dotenv.config();

/**
 * Router Definition
 */
export const loginRouter = express.Router();

/**
 * Controller Definitions
 */

/* Admin */

loginRouter.post('/admin', async (req: Request, res: Response) => {

    const params: any = {
        email: req.body.email,
        password: req.body.password
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
        });

    const {error}: any = schema.validate(params, {abortEarly: false});
    if (error != null)
        return failValidation(res, error);

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null)
        return failError(res);

    Admin(sequelize).findOne({where: {email: params.email}})
        .then(admin => {
            if (!admin)
                return failUnauthorized(res);

            if (!bcrypt.compareSync(params.password, admin.password))
                return failUnauthorized(res);

            const payload: AuthPayload = {
                auth: {
                    type: 'Admin',
                    uuid: admin.adminUuid
                }
            };
            const token = jwt.sign(
                payload,
                env('JWT_SECRET'),
                {
                    expiresIn: '2h'
                });

            res.status(200).json({'token': token});
        })
        .catch(err => failError(res, err));
});

/* User */

loginRouter.post('/user', async (req: Request, res: Response) => {

    const params: any = {
        email: req.body.string,
        password: req.body.password
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
        });

    const {error}: any = schema.validate(params, {abortEarly: false});
    if (error != null) {
        failValidation(res, error);

    } else {
        const sequelize: Sequelize | null = await connect();
        if (sequelize == null) {
            failError(res);

        } else {
            User(sequelize).findOne({where: {email: params.email}})
                .then(user => {
                    if (!user)
                        return failUnauthorized(res);

                    if (!bcrypt.compareSync(params.password, user.password))
                        return failUnauthorized(res);

                    const payload: AuthPayload = {
                        auth: {
                            type: 'User',
                            uuid: user.userUuid
                        }
                    };
                    const token = jwt.sign(
                        payload,
                        env('JWT_SECRET'),
                        {
                            expiresIn: '2h'
                        });

                    res.status(200).json({'token': token});
                })
                .catch(err => failError(res, err));
        }
    }
});