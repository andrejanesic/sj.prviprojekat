import {DataTypes, Model, Sequelize} from 'sequelize';

export interface ResetAttributes {
    resetId: number,
    resetUuid: string,
    token: string,
    refUuid: string,
    refType: 'User' | 'Admin',
    validBy: Date,
}

/**
 * Reset class. Needs to be instantiated via dynamic constructor.
 */
class Reset extends Model<ResetAttributes> implements ResetAttributes {

    resetId!: number;
    resetUuid!: string;
    token!: string;
    refUuid!: string;
    refType!: 'User' | 'Admin';
    validBy!: Date;

    /*static associate({}) {

    }*/
}

/**
 * Reset class dynamic constructor.
 */
export default (sequelize: Sequelize): typeof Reset => {

    Reset.init({

        /* Non-null */

        resetId: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
        },

        resetUuid: {
            unique: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true,
                isUUID: 4,
            },
        },

        token: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },

        refUuid: {
            type: DataTypes.UUID,
            allowNull: false,
            validate: {
                notEmpty: true,
                isUUID: 4,
            },
        },

        refType: {
            type: DataTypes.ENUM('User', 'Admin'),
            allowNull: false,
        },

        validBy: {
            type: DataTypes.DATE,
            allowNull: false,
        }

    }, {
        sequelize: sequelize,
        modelName: 'Reset',
        paranoid: true,
    });

    return Reset;
};