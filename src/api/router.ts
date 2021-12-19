/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from 'express';
import * as dotenv from 'dotenv';
import {connect} from '../db/service';
import User from '../db/models/user';
import sequelize, {Sequelize} from 'sequelize';
import log from '../logger/service';

dotenv.config();

/**
 * Router Definition
 */
export const router = express.Router();

/**
 * Controller Definitions
 */

// GET all
router.get('/', async (req: Request, res: Response) => {

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {
        User(sequelize).findAll()
            .then(rows => res.json(rows))
            .catch(err => error(res, err));
    }
});

// GET id
router.get('/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {
        User(sequelize).findByPk(id)
            .then(rows => res.json(rows))
            .catch(err => error(res, err));
    }
});

// GET uuid
router.get('/:uuid', async (req: Request, res: Response) => {
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
router.post('/', async (req: Request, res: Response) => {

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {
        let params: object = {
            bio: req.body.bio != null ? req.body.bio : '',
            email: req.body.email,
            firstName: req.body.firstName != null ? req.body.firstName : '',
            isAdminBilling: req.body.isAdminBilling,
            isAdminMaster: req.body.isAdminMaster,
            lastName: req.body.lastName != null ? req.body.lastName : '',
            licenseId: req.body.licenseId,
            password: req.body.password,
            role: req.body.role != null ? req.body.role : '',
        };
        // @ts-ignore
        User(sequelize).create(params)
            .then(rows => res.json(rows))
            .catch(err => error(res));
    }
});

// PUT id update
router.put('/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {
        // @ts-ignore
        User(sequelize).findByPk(id)
            .then(user => {
                if (user == null) {
                    error(res, 'User is null!');
                    return;
                }

                if (req.body.bio != null) user.bio = req.body.bio;
                if (req.body.email != null) user.email = req.body.email;
                if (req.body.firstName != null) user.firstName = req.body.firstName;
                if (req.body.isAdminBilling != null) user.isAdminBilling = req.body.isAdminBilling;
                if (req.body.isAdminMaster != null) user.isAdminMaster = req.body.isAdminMaster;
                if (req.body.lastName != null) user.lastName = req.body.lastName;
                if (req.body.licenseId != null) user.licenseId = req.body.licenseId;
                if (req.body.password != null) user.password = req.body.password;
                if (req.body.role != null) user.role = req.body.role;

                user.save()
                    .then(rows => res.json(rows))
                    .catch(err => error(res, err));
            })
            .catch(err => error(res, err));
    }
});

// PUT id update
router.put('/:uuid', async (req: Request, res: Response) => {

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {
        // @ts-ignore
        User(sequelize).findOne({where: {userUuid: req.params.uuid}})
            .then(user => {
                if (user == null) {
                    error(res, 'User is null!');
                    return;
                }

                if (req.body.bio != null) user.bio = req.body.bio;
                if (req.body.email != null) user.email = req.body.email;
                if (req.body.firstName != null) user.firstName = req.body.firstName;
                if (req.body.isAdminBilling != null) user.isAdminBilling = req.body.isAdminBilling;
                if (req.body.isAdminMaster != null) user.isAdminMaster = req.body.isAdminMaster;
                if (req.body.lastName != null) user.lastName = req.body.lastName;
                if (req.body.licenseId != null) user.licenseId = req.body.licenseId;
                if (req.body.password != null) user.password = req.body.password;
                if (req.body.role != null) user.role = req.body.role;

                user.save()
                    .then(rows => res.json(rows))
                    .catch(err => error(res, err));
            })
            .catch(err => error(res, err));
    }
});

// DELETE id delete
router.delete('/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {
        User(sequelize).findByPk(id)
            .then(user => {
                if (user == null) {
                    error(res, 'User is null!');
                    return;
                }

                user.destroy()
                    .then(rows => res.json(rows))
                    .catch(err => error(res, err));
            })
            .catch(err => error(res, err));
    }
});

// DELETE id delete
router.delete('/:uuid', async (req: Request, res: Response) => {

    // #TODO add validation
    // #TODO add auth, this function is only limited to ADMINS
    // #TODO check if user has perms to do all this!

    const sequelize: Sequelize | null = await connect();
    if (sequelize == null) {
        error(res);
    } else {
        User(sequelize).findOne({where: {userUuid: req.params.uuid}})
            .then(user => {
                if (user == null) {
                    error(res, 'User is null!');
                    return;
                }

                user.destroy()
                    .then(rows => res.json(rows))
                    .catch(err => error(res, err));
            })
            .catch(err => error(res, err));
    }
});

/**
 * Helper function for handling errors.
 * @param res Response object.
 * @param e Error or any printable object.
 */
function error(res: Response, e?: any): void {
    if (e != null) log(e);
    res
        .status(500)
        .send('Failed to execute request.');
}