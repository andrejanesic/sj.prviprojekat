/**
 * Required External Modules and Interfaces
 */
import express, {Request, Response} from 'express';
import * as dotenv from 'dotenv';
import {connect} from '../../db/service';
import {Sequelize} from 'sequelize';
import Joi from 'joi';

dotenv.config();

/**
 * Router Definition
 */
export const adminRouter = express.Router();

/**
 * Controller Definitions
 */

adminRouter.get('/', (req: Request, res: Response) => {
    // #TODO add auth!
    res.render('admin/pages/index.ejs');
});

adminRouter.get('/login', (req: Request, res: Response) => {
    // #TODO add auth!
    res.render('admin/pages/login.ejs');
});

adminRouter.get('/users', (req: Request, res: Response) => {
    // #TODO add auth!
    res.render('admin/pages/users.ejs');
});

adminRouter.get('/funnels', (req: Request, res: Response) => {
    // #TODO add auth!
    res.render('admin/pages/funnels.ejs');
});

adminRouter.get('/campaigns', (req: Request, res: Response) => {
    // #TODO add auth!
    res.render('admin/pages/campaigns.ejs');
});

adminRouter.get('/licenses', (req: Request, res: Response) => {
    // #TODO add auth!
    res.render('admin/pages/licenses.ejs');
});