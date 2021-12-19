/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from 'express';
import * as dotenv from 'dotenv';
import {connect} from '../db/service';
import User from '../db/models/user';
import {Sequelize} from 'sequelize';
import License from '../db/models/license';
import error from './baseRouter';

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

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res, 'Sequelize is null!');
    } else {
        User(sequelize).findAll()
            .then(rows => res.json(rows))
            .catch(err => error(res, err));
    }
});

// GET uuid
usersRouter.get('/:uuid', async (req: Request, res: Response) => {
    const uuid: string = req.params.uuid;

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {
        User(sequelize).findOne({where: {userUuid: uuid}})
            .then(rows => res.json(rows))
            .catch(err => error(res, err));
    }
});

// POST create
usersRouter.post('/', async (req: Request, res: Response) => {

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {
        let params: any = {
            bio: req.body.bio != null ? req.body.bio : '',
            email: req.body.email,
            firstName: req.body.firstName != null ? req.body.firstName : '',
            isAdminBilling: req.body.isAdminBilling === 'true',
            isAdminMaster: req.body.isAdminMaster === 'true',
            lastName: req.body.lastName != null ? req.body.lastName : '',
            licenseId: req.body.licenseId != null ? parseInt(req.body.licenseId, 10) : -1,
            password: req.body.password,
            role: req.body.role != null ? req.body.role : '',
        };

        // if new team (set licenseId = -1) then make a new license
        if (params.licenseId < 0) {
            // @ts-ignore
            License(sequelize).create({
                type: 'FREE'
            })
                .then((value) => {
                    params.licenseId = value.licenseId;
                    params.isAdminMaster = true;
                    params.isAdminBilling = true;

                    // @ts-ignore
                    User(sequelize).create(params)
                        .then(rows => res.json(rows))
                        .catch(err => error(res, err));
                })
                .catch(err => error(res, err));
        } else {
            // @ts-ignore
            User(sequelize).create(params)
                .then(rows => res.json(rows))
                .catch(err => error(res, err));
        }
    }
});

// PUT uuid update
usersRouter.put('/:uuid', async (req: Request, res: Response) => {

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {
        let params: any = {};

        if (req.body.bio != null) params.bio = req.body.bio;
        if (req.body.email != null) params.email = req.body.email;
        if (req.body.firstName != null) params.firstName = req.body.firstName;
        if (req.body.isAdminBilling != null) params.isAdminBilling = req.body.isAdminBilling === 'true';
        if (req.body.isAdminMaster != null) params.isAdminMaster = req.body.isAdminMaster === 'true';
        if (req.body.lastName != null) params.lastName = req.body.lastName;
        if (req.body.licenseId != null) params.licenseId = parseInt(req.body.licenseId, 10);
        if (req.body.password != null) params.password = req.body.password;
        if (req.body.role != null) params.role = req.body.role;

        // if changing teams (set licenseId = -1) then make a new license
        if (parseInt(req.body.licenseId, 10) < 0) {
            // @ts-ignore
            License(sequelize).create({
                type: 'FREE'
            })
                .then((value) => {
                    params.licenseId = value.licenseId;

                    User(sequelize).update(params, {where: {userUuid: req.params.uuid}})
                        .then(rows => res.json(rows))
                        .catch(err => error(res, err));
                })
                .catch(err => error(res, err));
        } else {
            // #TODO prevent end users from transferring themselves into different teams!

            User(sequelize).update(params, {where: {userUuid: req.params.uuid}})
                .then(rows => res.json(rows))
                .catch(err => error(res, err));
        }
    }
});

// DELETE uuid delete
usersRouter.delete('/:uuid', async (req: Request, res: Response) => {

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {
        User(sequelize).destroy({where: {userUuid: req.params.uuid}})
            .then(rows => res.json(rows))
            .catch(err => error(res, err));
    }
});