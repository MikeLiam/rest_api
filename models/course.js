'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}
  Course.init({
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
    },
    sequelize });


  Course.associate = (models) => {
    // Add associations.
    Course.belongsTo(models.User, {
      as: 'createdBy', // alias
      foreignKey: 'userId',
      allowNull: false,
              validate: {
          notEmpty: {
            msg: '"UserId" is required'
          }
        }
    });
  };

  return Course;
};