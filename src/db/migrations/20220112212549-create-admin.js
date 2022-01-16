'use strict';

module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable('Admins', {

            /* Non-null */

            adminId: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
            },


            adminUuid: {
                unique: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    isUUID: 4,
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
                type: DataTypes.STRING(60),
                allowNull: false,
            },

            permManageAdmins: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },

            /* Nullable */

            firstName: {
                type: DataTypes.STRING(30),
                allowNull: true,
                validate: {
                    is: /^$|^[\p{L}'\- ]+$/iu
                },
            },

            lastName: {
                type: DataTypes.STRING(30),
                allowNull: true,
                validate: {
                    is: /^$|^[\p{L}'\- ]+$/iu
                },
            },

            employeeId: {
                type: DataTypes.STRING(30),
                allowNull: true,
                validate: {
                    is: /^$|^[\p{L}'\- ]+$/iu
                },
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
        await queryInterface.dropTable('Admins');
    }
};