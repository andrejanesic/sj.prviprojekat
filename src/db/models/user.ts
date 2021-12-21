import {DataTypes, Model, Sequelize} from 'sequelize';
import License from './license';

interface UserAttributes {
    userId: number,
    userUuid: string,
    licenseUuid: number,
    email: string,
    password: string,
    isAdminMaster: boolean,
    isAdminBilling: boolean,
    firstName: string | null,
    lastName: string | null,
    role: string | null,
    bio: string | null,
}

/**
 * User class. Needs to be instantiated via dynamic constructor.
 */
class User extends Model<UserAttributes> implements UserAttributes {

    bio!: string | null;
    email!: string;
    firstName!: string | null;
    isAdminBilling!: boolean;
    isAdminMaster!: boolean;
    lastName!: string | null;
    licenseUuid!: number;
    password!: string;
    role!: string | null;
    userId!: number;
    userUuid!: string;

    /*static associate({}) {

    }*/
}

/**
 * User class dynamic constructor.
 */
export default (sequelize: Sequelize): typeof User => {

    User.init({

        /* Non-null */

        userId: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
        },

        userUuid: {
            unique: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true,
                isUUID: 4,
            },
        },

        licenseUuid: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: License(sequelize),
                key: 'licenseUuid'
            },
        },

        email: {
            unique: true,
            type: DataTypes.STRING(40),
            allowNull: false,
            validate: {
                notEmpty: true,
                isEmail: true,
            },
        },

        password: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },

        isAdminMaster: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },

        isAdminBilling: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },

        /* Nullable */

        firstName: {
            type: DataTypes.STRING(30),
            allowNull: true,
            validate: {
                is: /^$|^[\p{L}'\- ]+$/iu
            },
        },

        lastName: {
            type: DataTypes.STRING(30),
            allowNull: true,
            validate: {
                is: /^$|^[\p{L}'\- ]+$/iu
            },
        },

        role: {
            type: DataTypes.STRING(80),
            allowNull: true,
        },

        bio: {
            type: DataTypes.TEXT(),
            allowNull: true,
        },

    }, {
        sequelize: sequelize,
        modelName: 'User',
        paranoid: true,
    });

    return User;
};