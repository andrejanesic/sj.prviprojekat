import {NextFunction, Request, Response} from 'express';
import {Sequelize} from 'sequelize';
import {connect} from '../db/service';
import {failError, failForbidden} from '../helpers/response';
import {AuthPayloadRequest} from './authentication';

/**
 * Middleware for checking whether the authorized user is of the right type and with the right permissions.
 * @param model Model object from /models.
 * @param userType User type ('Admin' or 'User').
 * @param userUuidKey UUID key column name of the corresponding model.
 * @param perm Permission column name.
 */
export function hasPermission(model: (seq: Sequelize) => {
                                  findOne: (condition: any) => Promise<any>
                              },
                              userType: string,
                              userUuidKey: string,
                              perm: string):
    ((req: Request, res: Response, next: NextFunction) => any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        let uuidKey: string | null = null;
        let uuidValue: string | null = null;
        try {
            if (userType != (<AuthPayloadRequest>req).auth.type) {
                failForbidden(res);
            } else {
                uuidKey = (<AuthPayloadRequest>req).auth.type + 'Uuid';
                uuidValue = (<AuthPayloadRequest>req).auth.uuid;

                if (!uuidKey || !uuidValue) {
                    failError(res, 'Couldn\'t retrieve uuidKey or uuidValue!');
                } else {
                    const sequelize: Sequelize | null = await connect();
                    if (sequelize == null) {
                        failError(res, 'Sequelize is null!');
                    } else {
                        model(sequelize)
                            .findOne({where: {uuidKey: uuidValue}})
                            .then(val => {
                                let index: number = Object.keys(val).indexOf(perm);
                                if (index < 0) {
                                    failError(res, 'Column \'' + perm + '\' not set!');
                                } else {
                                    // @ts-ignore
                                    if (val[perm] == true) {
                                        next();
                                    } else {
                                        failForbidden(res);
                                    }
                                }
                            })
                            .catch(e => {
                                failError(res, e);
                            });
                    }
                }
            }
        } catch (e) {
            failError(res, e);
        }
    }
}