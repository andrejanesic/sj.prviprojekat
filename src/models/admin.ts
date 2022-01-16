import {DataTypes, Model, Sequelize} from 'sequelize';

export interface AdminAttributes {
    adminId: number,
    adminUuid: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    employeeId: string,
    permManageAdmins: boolean,
}

/**
 * Admin class. Needs to be instantiated via dynamic constructor.
 */
class Admin extends Model<AdminAttributes> implements AdminAttributes {

    adminId!: number;
    adminUuid!: string;
    email!: string;
    password!: string;
    firstName!: string;
    lastName!: string;
    employeeId!: string;
    permManageAdmins!: boolean;

    /*static associate({}) {

    }*/
}

/**
 * Admin class dynamic constructor.
 */
export default (sequelize: Sequelize): typeof Admin => {

    Admin.init({

        /* Non-null */

        adminId: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
        },


        adminUuid: {
            unique: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true,
                isUUID: 4,
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

        permManageAdmins: {
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

        employeeId: {
            type: DataTypes.STRING(30),
            allowNull: true,
            validate: {
                is: /^$|^[\p{L}'\- ]+$/iu
            },
        },

    }, {
        sequelize: sequelize,
        modelName: 'Admin',
        paranoid: true,
    });

    return Admin;
};