import {DataTypes, Model, Sequelize} from 'sequelize';

export type LicenseType = 'FREE';

/**
 * License attributes.
 */
export interface LicenseAttributes {

    // internal license ID
    licenseId: number,

    // license UUID
    licenseUuid: string,

    // license reference (billing ref ID)
    reference: string | null,

    // license type
    type: LicenseType,

    // domain to accept new users from
    // #TODO implement domain checking for user seat invites!
    domain: string | null,

    // team name
    teamName: string,

    // for support to turn off teams easily
    active: boolean,
}

/**
 * License class. Needs to be instantiated via dynamic constructor.
 */
class License extends Model<LicenseAttributes> implements LicenseAttributes{

    domain!: string | null;
    licenseId!: number;
    licenseUuid!: string;
    reference!: string | null;
    type!: LicenseType;
    teamName!: string;
    active!: boolean;

    /*static associate({}) {

    }*/
}

/**
 * License class dynamic constructor.
 */
export default (sequelize: Sequelize): typeof License => {

    License.init({

        /* Non-null */

        licenseId: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
        },

        licenseUuid: {
            unique: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true,
                isUUID: 4,
            },
        },

        type: {
            // #TODO replace this with dynamic method call
            type: DataTypes.ENUM(
                'FREE'
            ),
            allowNull: false,
        },

        teamName: {
            type: DataTypes.STRING(25),
            allowNull: false,
        },

        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },

        /* Nullable */

        reference: {
            unique: true,
            type: DataTypes.STRING(64),
            allowNull: true,
        },

        domain: {
            type: DataTypes.STRING(40),
            allowNull: true,
        },

    }, {
        sequelize: sequelize,
        modelName: 'License',
        paranoid: true,
    });

    return License;
}