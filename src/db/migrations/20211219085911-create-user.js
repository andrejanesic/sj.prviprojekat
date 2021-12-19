'use strict';

module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable('Users', {

            /* Non-null */

            userId: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
            },

            userUuid: {
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

            isAdminMaster: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },

            isAdminBilling: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },

            /* Nullable */

            firstName: {
                type: DataTypes.STRING(30),
                allowNull: true,
                validate: {
                    is: /^[\p{L}'\- ]+$/iu
                },
            },

            lastName: {
                type: DataTypes.STRING(30),
                allowNull: true,
                validate: {
                    is: /^[\p{L}'\- ]+$/iu
                },
            },

            role: {
                type: DataTypes.STRING(80),
                allowNull: true,
            },

            bio: {
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
        await queryInterface.dropTable('Users');
    }
};