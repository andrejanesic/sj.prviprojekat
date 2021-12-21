'use strict';

module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable('Licenses', {

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
                type: DataTypes.ENUM(['FREE']),
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
                type: DataTypes.STRING(64),
                allowNull: true,
                validate: {
                    is: /^[a-zA-Z0-9_-]+$/i
                },
            },

            domain: {
                type: DataTypes.STRING(50),
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
        await queryInterface.dropTable('Licenses');
    }
};