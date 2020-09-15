const colors = require('colors')

const { sequelize, models } = require('./db');

// Get references to our models.
const { User, Course } = models;

console.log('Testing the connection to the database...'.bgWhite.green);

(async () => {
  try {
    // Test the connection to the database
    await sequelize.authenticate().catch(err => {
      console.log('Error connecting database');
      throw err
    });
    console.log('Connection to the database successful!'.bgWhite.green);

    // Sync the models
    await sequelize.sync({ force: false });
    console.log('Synchronizing the models with the database...'.bgWhite.green);
    
  } catch (error) {
      throw error;
  }
})();
