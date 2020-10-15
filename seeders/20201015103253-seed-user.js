'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        "firstName": "Joe",
        "lastName": "Smith",
        "emailAddress": "joe@smith.com",
        "password": "joepassword"
      },
      {
        "firstName": "Sally",
        "lastName": "Jones",
        "emailAddress": "sally@jones.com",
        "password": "sallypassword"
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
};
