'use strict';

module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable('Resets', {

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
        await queryInterface.dropTable('Resets');
    }
};