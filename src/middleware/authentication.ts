import {NextFunction, Request, Response} from 'express';
import {Sequelize} from 'sequelize';
import User, {UserAttributes} from '../models/user';
import {connect} from '../db/service';
import {failError} from '../helpers/response';
import {authorized} from '../helpers/authorized';
import Admin, {AdminAttributes} from '../models/admin';

export interface AuthPayload {

    /**
     * Data about the authenticated user/admin.
     */
    auth: {

        /**
         * UUID of the user or admin.
         */
        uuid: string;

        /**
         * User type: backoffice (admin) or regular user (user).
         */
        type: 'Admin' | 'User';
    }

}

/**
 * Payload for JWT authentication token.
 */
export interface AuthPayloadRequest extends Request, AuthPayload {

}

/**
 * Middleware for authorizing users. Sets the user UUID if authorized properly.
 * @param req Extended request object. {@see AuthPayloadRequest}.
 * @param res Response object.
 * @param next Next function.
 */
export function authorizeUser(req: Request, res: Response, next: NextFunction): any {
    let auth: AuthPayload | null = authorized(req);
    if (!auth || auth.auth.type != 'User') {
        res.status(401).send('You must be logged in.');
    } else {
        (<AuthPayloadRequest>req).auth.uuid = auth.auth.uuid;
        (<AuthPayloadRequest>req).auth.type = auth.auth.type;
        next();
    }
}

/**
 * Middleware for authorizing users. Sets the user UUID if authorized properly.
 * @param req Extended request object. {@see AuthPayloadRequest}.
 * @param res Response object.
 * @param next Next function.
 */
export function authorizeAdmin(req: Request, res: Response, next: NextFunction): any {
    let auth: AuthPayload | null = authorized(req);
    if (!auth || auth.auth.type != 'Admin') {
        res.status(401).send('You must be logged in.');
    } else {
        (<AuthPayloadRequest>req).auth.uuid = auth.auth.uuid;
        (<AuthPayloadRequest>req).auth.type = auth.auth.type;
        next();
    }
}

/**
 * Middleware for authorizing users or admins (back-office.)
 * @param req AuthenticationPayloadRequest object.
 * @param res Response object.
 * @param next Next function.
 */
export function authorizeUserOrAdmin(req: Request, res: Response, next: NextFunction): any {
    let auth: AuthPayload | null = authorized(req);
    if (!auth) {
        res.status(401).send('You must be logged in.');
    } else {
        next();
    }
}

/**
 * Middle for authorizing and validating users. Runs the {@link authorizeUser} middleware internally.
 * @param req AuthenticationPayloadRequest object.
 * @param res Response object.
 * @param next Next function.
 */
export async function isUser(req: Request, res: Response, next: NextFunction) {
    let auth: AuthPayload | null = authorized(req);
    if (!auth || auth.auth.type != 'User') {
        res.redirect('/login');
    } else {
        const sequelize: Sequelize | null = await connect();
        if (sequelize == null) {
            failError(res, 'Sequelize is null!');
        } else {
            let requester: UserAttributes | null = await User(sequelize)
                .findOne({where: {userUuid: auth.auth.uuid}});
            if (!requester) {
                res.status(403).send('Invalid permissions.');
            } else {
                next();
            }
        }
    }
}

/**
 * Middle for authorizing and validating admins. Runs the {@link authorizeAdmin} middleware internally.
 * @param req AuthenticationPayloadRequest object.
 * @param res Response object.
 * @param next Next function.
 */
export async function isAdmin(req: Request, res: Response, next: NextFunction) {
    let auth: AuthPayload | null = authorized(req);
    if (!auth || auth.auth.type != 'Admin') {
        res.redirect('/admin/login');
    } else {
        const sequelize: Sequelize | null = await connect();
        if (sequelize == null) {
            failError(res, 'Sequelize is null!');
        } else {
            let requester: AdminAttributes | null = await Admin(sequelize)
                .findOne({where: {adminUuid: auth.auth.uuid}});
            if (!requester) {
                res.status(403).send('Invalid permissions.');
            } else {
                next();
            }
        }
    }
}

/**
 * Middle for authorizing and validating users or admins. Runs the {@link authorizeUserOrAdmin} middleware internally.
 * @param req AuthenticationPayloadRequest object.
 * @param res Response object.
 * @param next Next function.
 */
export async function isUserOrAdmin(req: Request, res: Response, next: NextFunction) {
    let auth: AuthPayload | null = authorized(req);
    if (!auth) {
        res.status(401).send('You must be logged in.');
    } else {
        const sequelize: Sequelize | null = await connect();
        if (sequelize == null) {
            failError(res, 'Sequelize is null!');
        } else {
            if (auth.auth.type == 'User') {
                let requester: UserAttributes | null = await User(sequelize)
                    .findOne({where: {userUuid: auth.auth.uuid}});
                if (!requester) {
                    res.status(403).send('Invalid permissions.');
                } else {
                    next();
                }
            } else {
                let requester: AdminAttributes | null = await Admin(sequelize)
                    .findOne({where: {adminUuid: auth.auth.uuid}});
                if (!requester) {
                    res.status(403).send('Invalid permissions.');
                } else {
                    next();
                }
            }
        }
    }
}