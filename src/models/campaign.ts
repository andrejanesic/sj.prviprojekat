import {DataTypes, Model, Sequelize} from 'sequelize';
import License from './license';

export interface CampaignAttributes {
    campaignId: number,
    campaignUuid: string,
    licenseId: number,
    name: string,
    icon: string | null,
    color: string | null,
    description: string | null,
}

/**
 * Campaign class. Needs to be instantiated via dynamic constructor.
 */
class Campaign extends Model<CampaignAttributes> implements CampaignAttributes {

    campaignId!: number;
    campaignUuid!: string;
    licenseId!: number;
    name!: string;
    icon!: string | null;
    variables!: string | null;
    description!: string | null;
    color!: string | null;

    /*static associate({}) {

    }*/

    // #TODO add support for variables!
}

/**
 * Campaign class dynamic constructor.
 */
export default (sequelize: Sequelize): typeof Campaign => {

    Campaign.init({

        /* Non-null */

        campaignId: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
        },

        campaignUuid: {
            unique: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true,
                isUUID: 4,
            },
        },

        licenseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: License(sequelize),
                key: 'licenseId'
            },
        },

        name: {
            unique: true,
            type: DataTypes.STRING(40),
            allowNull: false,
        },

        /* Nullable */

        icon: {
            type: DataTypes.STRING(15),
            allowNull: true,
        },

        color: {
            type: DataTypes.STRING(7),
            allowNull: true,
        },

        description: {
            type: DataTypes.TEXT(),
            allowNull: true,
        },

    }, {
        sequelize: sequelize,
        modelName: 'Campaign',
        paranoid: true,
    });

    return Campaign;
};