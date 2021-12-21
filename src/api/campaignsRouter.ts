/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from 'express';
import * as dotenv from 'dotenv';
import {connect} from '../db/service';
import {Sequelize} from 'sequelize';
import error from './baseRouter';
import Campaign from '../db/models/campaign';

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

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res, 'Sequelize is null!');
    } else {
        Campaign(sequelize).findAll()
            .then(rows => res.json(rows))
            .catch(err => error(res, err));
    }
});

// GET uuid
campaignsRouter.get('/:uuid', async (req: Request, res: Response) => {
    const uuid: string = req.params.uuid;

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {
        Campaign(sequelize).findOne({where: {campaignUuid: uuid}})
            .then(rows => res.json(rows))
            .catch(err => error(res, err));
    }
});

// POST create
campaignsRouter.post('/', async (req: Request, res: Response) => {

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {

        // #TODO add support for variables!

        let params: any = {
            licenseId: parseInt(req.body.licenseId, 10),
            name: req.body.name,
            description: req.body.description != null ? req.body.description : '',
            color: req.body.color != null ? req.body.color : '',
            icon: req.body.icon != null ? req.body.icon : '',
        };

        // #TODO fetch licenseId from user data if not backoffice!

        // @ts-ignore
        Campaign(sequelize).create(params)
            .then(rows => res.json(rows))
            .catch(err => error(res, err));
    }
});

// PUT uuid update
campaignsRouter.put('/:uuid', async (req: Request, res: Response) => {

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {

        // #TODO add support for variables!

        let params: any = {};

        if (req.body.licenseId != null) params.licenseId = parseInt(req.body.licenseId, 10);
        if (req.body.name != null) params.name = req.body.name;
        if (req.body.description != null) params.description = req.body.description;
        if (req.body.color != null) params.color = req.body.color;
        if (req.body.icon != null) params.icon = req.body.icon;

        // #TODO fetch licenseId from user data if not backoffice!

        Campaign(sequelize).update(params, {where: {campaignUuid: req.params.uuid}})
            .then(rows => res.json(rows))
            .catch(err => error(res, err));
    }
});

// DELETE uuid delete
campaignsRouter.delete('/:uuid', async (req: Request, res: Response) => {

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {
        Campaign(sequelize).destroy({where: {campaignUuid: req.params.uuid}})
            .then(rows => res.json(rows))
            .catch(err => error(res, err));
    }
});