'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
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
      },
      validate: {
        isEmail: { 
          args: [[true]],
          msg: 'emailAddress invalid'
        }
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, { sequelize });

  User.associate = (models) => {
    // Add associations.
    User.hasMany(models.Course, {
      as: 'createdBy', // alias
      foreignKey: 'userId',
      allowNull: false
    }); 
  };

  return User;
};
