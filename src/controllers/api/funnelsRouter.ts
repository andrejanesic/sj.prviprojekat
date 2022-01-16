/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from 'express';
import * as dotenv from 'dotenv';
import {connect} from '../../db/service';
import {FindOptions, Op, Sequelize} from 'sequelize';
import {failError, failUnauthorized, failValidation} from '../../helpers/response';
import Funnel, {FunnelAttributes} from '../../models/funnel';
import Joi from 'joi';
import {AuthPayloadRequest, isUserOrAdmin} from '../../middleware/authentication';
import User, {UserAttributes} from '../../models/user';
import License, {LicenseAttributes} from '../../models/license';
import Campaign, {CampaignAttributes} from '../../models/campaign';
import {filter} from '../../helpers/filters';

dotenv.config();

/**
 * Router Definition
 */
export const funnelsRouter = express.Router();
funnelsRouter.use(isUserOrAdmin);

/**
 * Controller Definitions
 */

const filterParams: string[] = ['funnelId', 'createdAt', 'updatedAt', 'deletedAt'];

// GET all
funnelsRouter.get('/', async (req: Request, res: Response) => {

    const sequelize: Sequelize | null = await connect();
    if (!sequelize)
        return failError(res, 'Sequelize is null!');

    // set query based on perms
    let options: FindOptions<FunnelAttributes> = {};

    // @ts-ignore
    let payload : AuthPayload = authorized(req);
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

        let campaigns: CampaignAttributes[] | null = await Campaign(sequelize)
            .findAll({where: {licenseId: license.licenseId}});

        if (!campaigns)
            return failUnauthorized(res);

        let campaignUuids: string[] = [];
        campaigns.forEach(c => {
            campaignUuids.push(c.campaignUuid);
        });

        options = {where: {campaignUuid: {[Op.or]: campaignUuids}}};
    }

    Funnel(sequelize).findAll(options)
        .then(rows => res.json(filter(
            rows,
            filterParams
        )))
        .catch(err => failError(res, err));
});

// GET uuid
funnelsRouter.get('/:uuid', async (req: Request, res: Response) => {

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
    if (sequelize == null)
        return failError(res);

    // set query based on perms
    let options: FindOptions<FunnelAttributes> = {};

    // @ts-ignore
    let payload : AuthPayload = authorized(req);
    if (payload.auth.type == 'Admin') {
        options = {where: {funnelUuid: uuid}};

        Funnel(sequelize).findOne(options)
            .then(rows => res.json(filter(
                rows,
                filterParams
            )))
            .catch(err => failError(res, err));

    } else {

        let funnel: FunnelAttributes | null = await Funnel(sequelize).findOne(options);

        if (!funnel)
            return failValidation(res, 'Funnel not found');

        // make sure user has access - find corresponding campaign with user's license
        let user: UserAttributes | null = await User(sequelize)
            .findOne({where: {userUuid: payload.auth.uuid}});

        if (!user)
            return failUnauthorized(res);

        let license: LicenseAttributes | null = await License(sequelize)
            .findOne({where: {licenseUuid: user.licenseUuid}});

        if (!license)
            return failError(res, 'Failed to fetch license for user.licenseUuid');

        let campaign: CampaignAttributes | null = await Campaign(sequelize)
            .findOne({where: {licenseId: license.licenseId, campaignUuid: funnel.campaignUuid}});

        if (!campaign)
            return failUnauthorized(res);

        return res.json(filter(
            funnel,
            filterParams
        ));
    }
});

// POST create
funnelsRouter.post('/', async (req: Request, res: Response) => {

    // #TODO add support for content and variables!

    let params: FunnelAttributes = {
        funnelId: 0,
        funnelUuid: '',
        campaignUuid: req.body.campaignUuid,
        name: req.body.description,
        isTemplate: req.body.isTemplate === 'true',
        description: req.body.description,
        type: req.body.type
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
        return failError(res);
    }

    // @ts-ignore
    let payload : AuthPayload = authorized(req);
    if (payload.auth.type == 'Admin') {
        Funnel(sequelize).create(params)
            .then(rows => res.status(201).json(filter(
                rows,
                filterParams
            )))
            .catch(err => failError(res, err));

    } else {

        // make sure user has access - find corresponding campaign with user's license
        let user: UserAttributes | null = await User(sequelize)
            .findOne({where: {userUuid: payload.auth.uuid}});

        if (!user)
            return failUnauthorized(res);

        let license: LicenseAttributes | null = await License(sequelize)
            .findOne({where: {licenseUuid: user.licenseUuid}});

        if (!license)
            return failError(res, 'Failed to fetch license for user.licenseUuid');

        let campaign: CampaignAttributes | null = await Campaign(sequelize)
            .findOne({where: {licenseId: license.licenseId, campaignUuid: params.campaignUuid}});

        if (!campaign)
            return failUnauthorized(res);

        Funnel(sequelize).create(params)
            .then(rows => res.status(201).json(filter(
                rows,
                filterParams
            )))
            .catch(err => failError(res, err));
    }
});

// PUT uuid update
funnelsRouter.put('/:uuid', async (req: Request, res: Response) => {

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
    if (sequelize == null)
        return failError(res);

    // @ts-ignore
    let payload : AuthPayload = authorized(req);
    if (payload.auth.type == 'Admin') {
        Funnel(sequelize).update(params, {where: {funnelUuid: uuid}})
            .then(() => res.status(204).send('Updated'))
            .catch(err => failError(res, err));

    } else {

        let funnel: FunnelAttributes | null = await Funnel(sequelize)
            .findOne({where: {funnelUuid: uuid}});

        if (!funnel)
            return failValidation(res, 'Funnel not found');

        // make sure user has access - find corresponding campaign with user's license
        let user: UserAttributes | null = await User(sequelize)
            .findOne({where: {userUuid: payload.auth.uuid}});

        if (!user)
            return failUnauthorized(res);

        let license: LicenseAttributes | null = await License(sequelize)
            .findOne({where: {licenseUuid: user.licenseUuid}});

        if (!license)
            return failError(res, 'Failed to fetch license for user.licenseUuid');

        let campaign: CampaignAttributes | null = await Campaign(sequelize)
            .findOne({where: {licenseId: license.licenseId, campaignUuid: funnel.campaignUuid}});

        if (!campaign)
            return failUnauthorized(res);

        // #TODO add support for content and variables!

        Funnel(sequelize).update(params, {where: {funnelUuid: uuid}})
            .then(() => res.status(204).send('Updated'))
            .catch(err => failError(res, err));
    }
});

// DELETE uuid delete
funnelsRouter.delete('/:uuid', async (req: Request, res: Response) => {

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
    if (sequelize == null)
        return failError(res);

    // @ts-ignore
    let payload : AuthPayload = authorized(req);
    if (payload.auth.type == 'Admin') {
        Funnel(sequelize).destroy({where: {funnelUuid: uuid}})
            .then(() => res.status(200).send('Deleted'))
            .catch(err => failError(res, err));

    } else {

        let funnel: FunnelAttributes | null = await Funnel(sequelize)
            .findOne({where: {funnelUuid: uuid}});

        if (!funnel)
            return failValidation(res, 'Funnel not found');

        // make sure user has access - find corresponding campaign with user's license
        let user: UserAttributes | null = await User(sequelize)
            .findOne({where: {userUuid: payload.auth.uuid}});

        if (!user)
            return failUnauthorized(res);

        let license: LicenseAttributes | null = await License(sequelize)
            .findOne({where: {licenseUuid: user.licenseUuid}});

        if (!license)
            return failError(res, 'Failed to fetch license for user.licenseUuid');

        let campaign: CampaignAttributes | null = await Campaign(sequelize)
            .findOne({where: {licenseId: license.licenseId, campaignUuid: funnel.campaignUuid}});

        if (!campaign)
            return failUnauthorized(res);

        Funnel(sequelize).destroy({where: {funnelUuid: uuid}})
            .then(() => res.status(200).send('Deleted'))
            .catch(err => failError(res, err));
    }
});