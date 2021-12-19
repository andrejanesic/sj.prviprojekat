/**
 * All models.
 */
import User from './user';
import {Sequelize} from 'sequelize';
import License from './license';

export default function models(sequelize: Sequelize) {
    return [
        License(sequelize),
        User(sequelize),
    ];
};