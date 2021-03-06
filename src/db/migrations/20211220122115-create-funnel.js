'use strict';

module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable('Funnels', {

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
                    model: 'Campaigns',
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
        await queryInterface.dropTable('Funnels');
    }
};