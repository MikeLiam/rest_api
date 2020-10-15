// Colored console messages
const colors = require('colors')


// Get references to our models.
const sequelize = require('./models').sequelize;
const User = require('./models').User;
const Course = require('./models').Course;

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
    console.log('Models synchronized with the database!'.bgWhite.green);
    
  } catch (error) {
      throw error;
  }
})();
