'use strict';

module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable('Campaigns', {

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
                    model: 'Licenses',
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

            /* Auto-generated */

            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },

            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },

            deletedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },

        });
    },

    down: async (queryInterface, DataTypes) => {
        await queryInterface.dropTable('Campaigns');
    }
};