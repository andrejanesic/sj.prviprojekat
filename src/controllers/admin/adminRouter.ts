/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from 'express';
import * as dotenv from 'dotenv';
import {connect} from '../../db/service';
import {Sequelize} from 'sequelize';
import {isAdmin} from '../../middleware/authentication';
import {failError} from '../../helpers/response';
import User from '../../models/user';
import License from '../../models/license';
import Funnel from '../../models/funnel';
import Campaign from '../../models/campaign';

dotenv.config();

/**
 * Router Definition
 */
export const adminRouter = express.Router();

/**
 * Controller Definitions
 */

adminRouter.get('/', isAdmin, (req: Request, res: Response) => {
    res.render('admin/pages/index.ejs');
});

adminRouter.get('/login', (req: Request, res: Response) => {
    // #TODO add auth!
    res.render('admin/pages/login.ejs');
});

adminRouter.get('/reset', (req: Request, res: Response) => {
    res.render('admin/pages/reset.ejs');
});

adminRouter.get('/reset/submit', (req: Request, res: Response) => {
    res.render('admin/pages/password.ejs');
});

adminRouter.get('/users', isAdmin, async (req: Request, res: Response) => {

    const sequelize: Sequelize | null = await connect();
    if (!sequelize)
        return failError(res, 'Sequelize is null!');

    let entities = await User(sequelize).findAll();
    if (entities == undefined) entities = [];
    res.render('admin/pages/model.ejs', {
        entities: entities,
        uuidCol: 'userUuid',
        columns: [
            {'name': 'licenseUuid', 'type': 'text'},
            {'name': 'email', 'type': 'email'},
            {'name': 'isAdminMaster', 'type': 'checkbox'},
            {'name': 'isAdminBilling', 'type': 'checkbox'},
            {'name': 'password', 'type': 'text'},
            {'name': 'firstName', 'type': 'text'},
            {'name': 'lastName', 'type': 'text'},
        ]
    });
});

adminRouter.get('/funnels', isAdmin, async (req: Request, res: Response) => {

    const sequelize: Sequelize | null = await connect();
    if (!sequelize)
        return failError(res, 'Sequelize is null!');

    let entities = await Funnel(sequelize).findAll();
    if (entities == undefined) entities = [];
    res.render('admin/pages/model.ejs', {
        entities: entities,
        uuidCol: 'funnelUuid',
        columns: [
            {'name': 'campaignUuid', 'type': 'text'},
            {'name': 'name', 'type': 'text'},
            {'name': 'isTemplate', 'type': 'checkbox'},
            {'name': 'type', 'type': 'text'},
            {'name': 'description', 'type': 'text'},
        ]
    });
});

adminRouter.get('/campaigns', isAdmin, async (req: Request, res: Response) => {

    const sequelize: Sequelize | null = await connect();
    if (!sequelize)
        return failError(res, 'Sequelize is null!');

    let entities = await Campaign(sequelize).findAll();
    if (entities == undefined) entities = [];
    res.render('admin/pages/model.ejs', {
        entities: entities,
        uuidCol: 'campaignUuid',
        columns: [
            {'name': 'licenseId', 'type': 'number'},
            {'name': 'name', 'type': 'text'},
            {'name': 'icon', 'type': 'text'},
            {'name': 'color', 'type': 'text'},
            {'name': 'description', 'type': 'text'},
        ]
    });
});

adminRouter.get('/licenses', isAdmin, async (req: Request, res: Response) => {

    const sequelize: Sequelize | null = await connect();
    if (!sequelize)
        return failError(res, 'Sequelize is null!');

    let entities = await License(sequelize).findAll();
    if (entities == undefined) entities = [];
    res.render('admin/pages/model.ejs', {
        entities: entities,
        uuidCol: 'licenseUuid',
        columns: [
            {'name': 'type', 'type': 'text'},
            {'name': 'teamName', 'type': 'text'},
            {'name': 'active', 'type': 'checkbox'},
            {'name': 'reference', 'type': 'text'},
            {'name': 'domain', 'type': 'text'},
        ]
    });
});