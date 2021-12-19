/**
 * For connecting with the database.
 */
import {Sequelize} from 'sequelize';
import {env} from '../helpers';
import log from '../logger/service';
import models from './model';

/**
 * Database connection. Static variable.
 */
let connection: Sequelize|null = null;

/**
 * Connects to the database. Returns a {@link Sequelize} object if successfully connected, null if fails. Authenticates
 * the database prior to returning.
 */
export async function connect(): Promise<Sequelize | null> {
    if (connection != null) return connection; // #TODO have to check if it's not closed

    // check that all necessary keys are defined
    for (const i of ['DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE', 'DB_HOST', 'DB_DIALECT']) {
        if (!env(i)) return null;
    }

    // start sequelize
    const sequelize: Sequelize = new Sequelize({
        username: env('DB_USERNAME'),
        password: env('DB_PASSWORD'),
        database: env('DB_DATABASE'),
        host: env('DB_HOST'),
        dialect: env('DB_DIALECT'),
    });

    // associate models if available
    models(sequelize).forEach((cls: any) => {
        if (typeof cls['associate'] === 'function')
            cls.associate();
    });

    // authenticate connection
    try {
        return sequelize.authenticate().then((value) => {
            connection = sequelize;
            return sequelize;
        }).catch((reason) => {
            log(reason);
            return null;
        });
    } catch (e) {
        log(e);
        return null;
    }
}