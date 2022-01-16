/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from 'express';
import * as dotenv from 'dotenv';
import {connect} from '../../db/service';
import {Sequelize} from 'sequelize';
import {failError, failForbidden, failUnauthorized, failValidation} from '../../helpers/response';
import Joi from 'joi';
import User from '../../models/user';
import bcrypt from 'bcryptjs';
import {env} from '../../helpers/env';
import Admin from '../../models/admin';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import Reset from '../../models/reset';

dotenv.config();

/**
 * Router Definition
 */
export const resetsRouter = express.Router();

/**
 * Controller Definitions
 */

/* Admin */

resetsRouter.post('/request/admin', async (req: Request, res: Response) => {

    const params: any = {
        email: req.body.email,
    };

    const schema: Joi.AnySchema = Joi
        .object({
            email: Joi
                .string()
                .email()
                .required(),
        });

    const {error}: any = schema.validate(params, {abortEarly: false});
    if (error != null)
        return failValidation(res, error);

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null)
        return failError(res);

    Admin(sequelize).findOne({where: {email: params.email}})
        .then(async admin => {

            if (!admin)
                return failUnauthorized(res);

            const token: string = crypto.randomBytes(8).toString('hex');
            const hash: string = bcrypt.hashSync(token, 10);
            let date: Date = new Date();
            date.setMinutes(date.getMinutes() + 10);
            // @ts-ignore
            let reset = await Reset(sequelize).create({
                refType: 'Admin',
                refUuid: admin.adminUuid,
                token: hash,
                validBy: date,
            }).catch(err => {
                return failError(res, err);
            });
            
            if (!reset)
                return failError(res);

            // TODO replace this with real account
            let acc = await nodemailer.createTestAccount();
            let transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: acc.user,
                    pass: acc.pass,
                },
            });

            const link = `${env('BASE_URL')}/admin/reset/submit` +
                `?token=${encodeURIComponent(token)}` +
                `&resetUuid=${encodeURIComponent(reset.resetUuid)}`;
            transporter.sendMail({
                from: '"Example App" <app@example.com>',
                to: params.email,
                subject: 'Your Password Reset Link',
                html: `
                    <p>Hey ${admin.firstName ? admin.firstName + ',' : 'there,'}</p>
                    <p>You've recently requested a password reset.</p>
                    <p>Here is your link: <a href="${link}">${link}</a></p>
                    <p>This link is only valid for 10 minutes.</p>
                    <p>If you didn't request this, please let us know immediately by replying.</p>
                    <p>Thanks,</p>
                    <p>Fiera Support</p>
                `,
            }).then(info => {
                // TODO remove
                console.log(link);
                res.status(200).send();
            }).catch(err => {
                return failError(res, err);
            });
        })
        .catch(err => failError(res, err));
});

resetsRouter.post('/submit/admin', async (req: Request, res: Response) => {

    const params: any = {
        token: req.body.token,
        password: req.body.password,
        resetUuid: req.body.resetUuid,
    };

    const schema: Joi.AnySchema = Joi
        .object({
            token: Joi
                .string()
                .length(16)
                .required(),

            resetUuid: Joi
                .string()
                .guid({version: 'uuidv4'})
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

    Reset(sequelize).findOne({where: {resetUuid: params.resetUuid}})
        .then(async reset => {
            if (!reset)
                return failUnauthorized(res);

            if (!bcrypt.compareSync(params.token, reset.token))
                return failUnauthorized(res);

            if (reset.validBy.getTime() - new Date().getTime() < 0)
                return failForbidden(res, 'Token expired');

            let admin = await Admin(sequelize).findOne({where: {adminUuid: reset.refUuid}});

            if (!admin)
                return failUnauthorized(res);

            await Admin(sequelize).update({
                password: bcrypt.hashSync(params.password, 10),
            }, {where: {adminId: admin.adminId}});

            res.status(200).send();
        })
        .catch(err => failError(res, err));
});

/* User */

resetsRouter.post('/request/user', async (req: Request, res: Response) => {

    const params: any = {
        email: req.body.email,
    };

    const schema: Joi.AnySchema = Joi
        .object({
            email: Joi
                .string()
                .email()
                .required(),
        });

    const {error}: any = schema.validate(params, {abortEarly: false});
    if (error != null)
        return failValidation(res, error);

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null)
        return failError(res);

    User(sequelize).findOne({where: {email: params.email}})
        .then(async user => {
            if (!user)
                return failUnauthorized(res);

            const token: string = crypto.randomBytes(8).toString('hex');
            const hash: string = bcrypt.hashSync(token, 10);
            let date: Date = new Date();
            date.setMinutes(date.getMinutes() + 10);
            let reset = await Reset(sequelize).create({
                refType: 'User',
                refUuid: user.userUuid,
                resetId: 0,
                resetUuid: '',
                token: hash,
                validBy: date,
            }).catch(err => {
                return failError(res, err);
            });

            if (!reset)
                return failError(res);

            // TODO replace this with real account
            let acc = await nodemailer.createTestAccount();
            let transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: acc.user,
                    pass: acc.pass,
                },
            });

            const link = `${env('BASE_URL')}/reset/submit` +
                `?token=${encodeURIComponent(token)}` +
                `&resetUuid=${encodeURIComponent(reset.resetUuid)}`;
            transporter.sendMail({
                from: '"Example App" <app@example.com>',
                to: params.email,
                subject: 'Your Password Reset Link',
                html: `
                    <p>Hey ${user.firstName ? user.firstName + ',' : 'there,'},</p>
                    <p>You've recently requested a password reset.</p>
                    <p>Here is your link: <a href="${link}">${link}</a></p>
                    <p>This link is only valid for 10 minutes.</p>
                    <p>If you didn't request this, please let us know immediately by replying.</p>
                    <p>Thanks,</p>
                    <p>Fiera Support</p>
                `,
            }).then(info => {
                res.status(200).send();
            }).catch(err => {
                return failError(res, err);
            });
        })
        .catch(err => failError(res, err));
});

resetsRouter.post('/submit/user', async (req: Request, res: Response) => {

    const params: any = {
        token: req.body.token,
        password: req.body.password,
        resetUuid: req.body.resetUuid,
    };

    const schema: Joi.AnySchema = Joi
        .object({
            token: Joi
                .string()
                .length(16)
                .required(),

            resetUuid: Joi
                .string()
                .guid({version: 'uuidv4'})
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

    Reset(sequelize).findOne({where: {resetUuid: params.resetUuid}})
        .then(async reset => {
            if (!reset)
                return failUnauthorized(res);

            if (!bcrypt.compareSync(params.token, reset.token))
                return failUnauthorized(res);

            if (reset.validBy.getTime() - new Date().getTime() < 0)
                return failForbidden(res, 'Token expired');

            let user = await User(sequelize).findOne({where: {userUuid: reset.refUuid}});

            if (!user)
                return failUnauthorized(res);

            await Admin(sequelize).update({
                password: bcrypt.hashSync(params.password, 10),
            }, {where: {adminId: user.userId}});

            res.status(200).send();
        })
        .catch(err => failError(res, err));
});