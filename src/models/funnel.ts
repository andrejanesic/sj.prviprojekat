import {DataTypes, Model, Sequelize} from 'sequelize';
import Campaign from './campaign';

export interface FunnelAttributes {
    funnelId: number,
    funnelUuid: string,
    campaignUuid: number,
    name: string,
    description: string | null,
    type: string | null,
    isTemplate: boolean,
}

/**
 * Funnel class. Needs to be instantiated via dynamic constructor.
 */
class Funnel extends Model<FunnelAttributes> implements FunnelAttributes {

    funnelId!: number;
    funnelUuid!: string;
    campaignUuid!: number;
    name!: string;
    description!: string | null;
    type!: string | null;
    isTemplate!: boolean;
    content!: string | null;

    /*static associate({}) {

    }*/

    // #TODO add support for content!
}

/**
 * Funnel class dynamic constructor.
 */
export default (sequelize: Sequelize): typeof Funnel => {

    Funnel.init({

        /* Non-null */

        funnelId: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
        },

        funnelUuid: {
            unique: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true,
                isUUID: 4,
            },
        },

        campaignUuid: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Campaign(sequelize),
                key: 'campaignUuid'
            },
        },

        name: {
            unique: true,
            type: DataTypes.STRING(60),
            allowNull: false,
        },

        isTemplate: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },

        /* Nullable */

        type: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },

        description: {
            type: DataTypes.TEXT(),
            allowNull: true,
        },

    }, {
        sequelize: sequelize,
        modelName: 'Funnel',
        paranoid: true,
    });

    return Funnel;
};