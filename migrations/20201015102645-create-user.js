'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      emailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          args: [[true]],
          msg: 'User with this emailAddress already exists'
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
    // return queryInterface.addColumn(
    //   'Users',
    //   'ProjectId',
    //   {
    //     type: Sequelize.INTEGER,
    //     references: {
    //       model: 'Courses',
    //       key: 'id'
    //     },
    //     onUpdate: 'CASCADE',
    //     onDelete: 'SET NULL',
    //   }
    // );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};
