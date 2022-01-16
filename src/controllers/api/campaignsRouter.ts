/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from 'express';
import * as dotenv from 'dotenv';
import {connect} from '../../db/service';
import {FindOptions, Sequelize} from 'sequelize';
import {failError, failUnauthorized, failValidation} from '../../helpers/response';
import Campaign, {CampaignAttributes} from '../../models/campaign';
import Joi from 'joi';
import {AuthPayload, isUserOrAdmin} from '../../middleware/authentication';
import User, {UserAttributes} from '../../models/user';
import License, {LicenseAttributes} from '../../models/license';
import {filter} from '../../helpers/filters';
import {authorized} from '../../helpers/authorized';
import Admin, {AdminAttributes} from '../../models/admin';

dotenv.config();

/**
 * Router Definition
 */
export const campaignsRouter = express.Router();
campaignsRouter.use(isUserOrAdmin);

/**
 * Controller Definitions
 */

const filterParams: string[] = ['campaignId', 'licenseId', 'createdAt', 'updatedAt', 'deletedAt'];

// GET all
campaignsRouter.get('/', async (req: Request, res: Response) => {

    const sequelize: Sequelize | null = await connect();
    if (!sequelize) {
        return failError(res, 'Sequelize is null!');
    }

    // set query based on perms
    let options: FindOptions<CampaignAttributes> = {};

    // @ts-ignore
    let payload: AuthPayload = authorized(req);
    if (payload.auth.type == 'Admin') {
        options = {};
    } else {
        let user: UserAttributes | null = await User(sequelize)
            .findOne({where: {userUuid: payload.auth.uuid}});

        if (!user)
            return failUnauthorized(res);

        let license: LicenseAttributes | null = await License(sequelize)
            .findOne({where: {licenseUuid: user.licenseUuid}});

        if (!license)
            return failError(res, 'Failed to fetch license for user.licenseUuid');

        options = {where: {licenseId: license?.licenseId}};
    }

    Campaign(sequelize).findAll(options)
        .then(rows => res.json(filter(
            rows,
            filterParams
        )))
        .catch(err => failError(res, err));
});

// GET uuid
campaignsRouter.get('/:uuid', async (req: Request, res: Response) => {

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
        return failError(res);
    }

    // set query based on perms
    let options: FindOptions<CampaignAttributes> = {};

    // @ts-ignore
    let payload: AuthPayload = authorized(req);
    if (payload.auth.type == 'Admin') {
        options = {where: {campaignUuid: uuid}};
    } else {
        // @ts-ignore
        let user: UserAttributes | null = await User(sequelize)
            .findOne({where: {userUuid: payload.auth.uuid}});

        if (!user)
            return failUnauthorized(res);

        let license: LicenseAttributes | null = await License(sequelize)
            .findOne({where: {licenseUuid: user.licenseUuid}});

        if (!license)
            return failError(res, 'Failed to fetch license for user.licenseUuid');

        options = {where: {campaignUuid: uuid, licenseId: license?.licenseId}};
    }

    Campaign(sequelize).findOne(options)
        .then(rows => res.json(filter(
            rows,
            filterParams
        )))
        .catch(err => failError(res, err));
});

// POST create
campaignsRouter.post('/', async (req: Request, res: Response) => {

    // #TODO add support for variables!

    // @ts-ignore
    let params: CampaignAttributes = {
        licenseId: req.body.licenseId,
        name: req.body.name,
        description: req.body.description,
        color: req.body.color,
        icon: req.body.icon
    };

    const schema: Joi.AnySchema = Joi
        .object({
            licenseId: Joi
                .number()
                .positive()
                .required(),

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
        return failError(res);
    }

    // @ts-ignore
    let payload: AuthPayload = authorized(req);

    // check by permission
    if (payload.auth.type === 'User') {
        let user: UserAttributes | null = await User(sequelize)
            .findOne({where: {userUuid: payload.auth.uuid}});

        if (!user)
            return failUnauthorized(res);

        let license: LicenseAttributes | null = await License(sequelize)
            .findOne({where: {licenseUuid: user.licenseUuid}});

        if (!license)
            return failError(res, 'Failed to fetch license for user.licenseUuid');

        params.licenseId = license.licenseId;
    } else {

        let admin: AdminAttributes | null = await Admin(sequelize)
            .findOne({where: {adminUuid: payload.auth.uuid}});

        if (!admin)
            return failUnauthorized(res);
    }

    Campaign(sequelize).create(params)
        .then(rows => res.status(201).json(filter(
            rows,
            filterParams
        )))
        .catch(err => failError(res, err));
});

// PUT uuid update
campaignsRouter.put('/:uuid', async (req: Request, res: Response) => {

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
        return failError(res);
    }

    // @ts-ignore
    let payload: AuthPayload = authorized(req);
    let user: UserAttributes | null = await User(sequelize)
        .findOne({where: {userUuid: payload.auth.uuid}});

    if (!user)
        return failUnauthorized(res);

    let license: LicenseAttributes | null = await License(sequelize)
        .findOne({where: {licenseUuid: user.licenseUuid}});

    if (!license)
        return failError(res, 'Failed to fetch license for user.licenseUuid');

    let campaign: CampaignAttributes | null = await Campaign(sequelize)
        .findOne({where: {licenseId: license.licenseId, campaignUuid: uuid}});

    if (!campaign)
        return failUnauthorized(res);

    Campaign(sequelize)
        .update(params, {where: {licenseId: license.licenseId, campaignUuid: uuid}})
        .then(rows => res.status(204).send('Updated'))
        .catch(err => failError(res, err));
});

// DELETE uuid delete
campaignsRouter.delete('/:uuid', async (req: Request, res: Response) => {

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

    // @ts-ignore
    let payload: AuthPayload = authorized(req);

    // check by permission
    if (payload.auth.type === 'User') {
        let user: UserAttributes | null = await User(sequelize)
            .findOne({where: {userUuid: payload.auth.uuid}});

        if (!user)
            return failUnauthorized(res);

        let license: LicenseAttributes | null = await License(sequelize)
            .findOne({where: {licenseUuid: user.licenseUuid}});

        if (!license)
            return failError(res, 'Failed to fetch license for user.licenseUuid');

        let campaign: CampaignAttributes | null = await Campaign(sequelize)
            .findOne({where: {licenseId: license.licenseId, campaignUuid: uuid}});

        if (!campaign)
            return failUnauthorized(res);
    } else {
        let admin: AdminAttributes | null = await Admin(sequelize)
            .findOne({where: {adminUuid: payload.auth.uuid}});

        if (!admin)
            return failUnauthorized(res);
    }

    Campaign(sequelize)
        .destroy({where: {campaignUuid: uuid}})
        .then(() => res.status(200).send('Deleted'))
        .catch(err => failError(res, err));
});