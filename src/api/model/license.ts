import {Model} from 'sequelize';

export enum LicenseLabel {
    FREE,
}

/**
 * License attributes.
 */
interface LicenseAttributes {
    licenseId: number,
    licenseUuid: string,
    reference: string | null,
    label: LicenseLabel,
    domain: string | null,
}

/**
 * License class. Needs to be instantiated via dynamic constructor.
 */
class License extends Model<LicenseAttributes> implements LicenseAttributes{

    domain!: string | null;
    licenseId!: number;
    licenseUuid!: string;
    reference!: string | null;
    label!: LicenseLabel;

    static associate({}) {

    }
}

/**
 * License class dynamic constructor.
 */
export default (sequelize: any, DataTypes: any): typeof License => {

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

        label: {
            type: DataTypes.ENUM(Object.values(LicenseLabel)),
            allowNull: false,
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