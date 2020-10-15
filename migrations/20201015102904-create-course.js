'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Courses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      estimatedTime: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      materialsNeeded: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    }, { 
      hooks: {
        // validation method to use not only on create but on update too
        beforeValidate: async (course, options) => {
          const error = new Error;
          let errors = [];
  
          error.name = "SequelizeValidationError"
          if (!course.dataValues.title) {
            errors.push({message: '"Title" is required'})
            
          }
          if (!course.dataValues.description) {
            errors.push({message: '"Description" is required'})
          }
          if (errors.length > 0) {
            error.errors = errors;
            throw error
          }
        }
      }
    });
    return queryInterface.addColumn(
      'Courses',
      'UserId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Courses');
    return queryInterface.removeColumn(
      'Courses',
      'UserId'
    );
  }
};
