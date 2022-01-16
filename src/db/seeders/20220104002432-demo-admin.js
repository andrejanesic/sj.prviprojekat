'use strict';
const faker = require('faker');
const {hashSync} = require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let dummy = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.lorem.words(3),
            permManageAdmins: true,
        };
        console.log(dummy);
        dummy.password = hashSync(dummy.password, 10);
        return queryInterface.bulkInsert('Admins', [dummy]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Admins', null, []);
    }
};