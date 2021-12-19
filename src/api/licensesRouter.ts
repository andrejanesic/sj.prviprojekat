/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from 'express';
import * as dotenv from 'dotenv';
import {connect} from '../db/service';
import License from '../db/models/license';
import {Sequelize} from 'sequelize';
import error from './baseRouter';

dotenv.config();

/**
 * Router Definition
 */
export const licensesRouter = express.Router();

/**
 * Controller Definitions
 */

// GET all
licensesRouter.get('/', async (req: Request, res: Response) => {

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if license has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {
        License(sequelize).findAll()
            .then(rows => res.json(rows))
            .catch(err => error(res, err));
    }
});

// GET uuid
licensesRouter.get('/:uuid', async (req: Request, res: Response) => {
    const uuid: string = req.params.uuid;

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if license has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {
        License(sequelize).findOne({where: {licenseUuid: uuid}})
            .then(rows => res.json(rows))
            .catch(err => error(res, err));
    }
});

// POST create
licensesRouter.post('/', async (req: Request, res: Response) => {

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if license has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {
        let params: object = {
            type: req.body.type != null ? req.body.type : '',
            reference: req.body.type != null ? req.body.type : '',
            domain: req.body.domain != null ? req.body.domain : '',
        };
        // @ts-ignore
        License(sequelize).create(params)
            .then(rows => res.json(rows))
            .catch(err => error(res, err));
    }
});

// PUT uuid update
licensesRouter.put('/:uuid', async (req: Request, res: Response) => {

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if license has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {
        let params: any = {};

        // #TODO prevent end users from changing anything about their license except team name and domain!
        if (req.body.type != null) params.type = req.body.type;
        if (req.body.reference != null) params.reference = req.body.reference;
        if (req.body.domain != null) params.domain = req.body.domain;

        License(sequelize).update(params, {where: {licenseUuid: req.params.uuid}})
            .then(rows => res.json(rows))
            .catch(err => error(res, err));
    }
});

// DELETE uuid delete
licensesRouter.delete('/:uuid', async (req: Request, res: Response) => {

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if license has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {
        License(sequelize).destroy({where: {licenseUuid: req.params.uuid}})
            .then(rows => res.json(rows))
            .catch(err => error(res, err));
    }
});