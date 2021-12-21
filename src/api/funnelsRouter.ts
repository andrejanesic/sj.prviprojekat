/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from 'express';
import * as dotenv from 'dotenv';
import {connect} from '../db/service';
import {Sequelize} from 'sequelize';
import error from './baseRouter';
import Funnel from '../db/models/funnel';

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

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res, 'Sequelize is null!');
    } else {
        Funnel(sequelize).findAll()
            .then(rows => res.json(rows))
            .catch(err => error(res, err));
    }
});

// GET uuid
funnelsRouter.get('/:uuid', async (req: Request, res: Response) => {
    const uuid: string = req.params.uuid;

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {
        Funnel(sequelize).findOne({where: {funnelUuid: uuid}})
            .then(rows => res.json(rows))
            .catch(err => error(res, err));
    }
});

// POST create
funnelsRouter.post('/', async (req: Request, res: Response) => {

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
        Funnel(sequelize).create(params)
            .then(rows => res.json(rows))
            .catch(err => error(res, err));
    }
});

// PUT uuid update
funnelsRouter.put('/:uuid', async (req: Request, res: Response) => {

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

        Funnel(sequelize).update(params, {where: {funnelUuid: req.params.uuid}})
            .then(rows => res.json(rows))
            .catch(err => error(res, err));
    }
});

// DELETE uuid delete
funnelsRouter.delete('/:uuid', async (req: Request, res: Response) => {

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {
        Funnel(sequelize).destroy({where: {funnelUuid: req.params.uuid}})
            .then(rows => res.json(rows))
            .catch(err => error(res, err));
    }
});