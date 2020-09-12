const express = require('express')
const router = express.Router()
// Helpers
const {
    fieldsValidator,
    asyncHandler,
    authenticateUser
} = require('../helper');
// Sequelize operators
const {
    Op
} = require("sequelize");
// Authentication modules
const auth = require('basic-auth')
const bcryptjs = require('bcryptjs')
const {
    validationResult
} = require('express-validator')

// Get references to our models.
const {
    models
} = require('../db');
const {
    User,
    Course
} = models;
// Colorized messages
const colors = require('colors')

// Route that returns the current authenticated user.
router.get('/users', authenticateUser, (req, res) => {
    const user = req.currentUser;

    res.json({
        emailAddress: user.emailAddress,
        name: user.firstName,
    });

});

// Route that creates a new user.
router.post('/users', fieldsValidator, async (req, res) => {
    // Attempt to get the validation result from the Request object.
    const errors = validationResult(req);

    // If there are validation errors...
    if (!errors.isEmpty()) {
        // Use the Array `map()` method to get a list of error messages.
        const errorMessages = errors.array().map(error => error.msg);
        // Return the validation errors to the client.
        return res.status(400).json({
            errors: errorMessages
        });

    }

    // Get the user from the request body.
    const user = req.body;

    // Hash the new user's password.
    user.password = bcryptjs.hashSync(user.password);

    await User.create(user)
        .then(user => {
            res.location(`/api/`)
            res.status(201).end()
        })
        .catch(err => {
            console.log("Error inserting course".bgRed, err)
            res.status(400).json({message: {...err.errors.forEach(error => error.message)}})
        })

    
});

// get all courses
router.get('/courses', asyncHandler(async (req, res) => {

    const courses = await Course.findAll({
        include: [{
            model: User,
            as: 'createdBy',
        }, ]
    });
    if (courses) {
        res.json(courses)
    } else {
        res.status(404).json({
            message: "There are no courses"
        })
    }

}));

// get :id course
router.get('/courses/:id', asyncHandler(async (req, res) => {

    const course = await Course.findByPk(req.params.id, {
        include: [{
            model: User,
            as: 'createdBy',
        }, ]
    });

    if (course) {
        res.json(course)
    } else {
        res.status(404).json({
            message: "There are no courses"
        })
    }

}));

// create new course
router.post('/courses', asyncHandler(async (req, res) => {

    const course = await Course.create(req.body)
        .then(course => res.location(`/api/courses/${course.id}`))
        //.catch(err => console.log("Error inserting course".bgRed, err))

    res.status(201).end()

}));

// Update course :id
router.put('/courses/:id', asyncHandler(async (req, res) => {
    let course = await Course.findByPk(req.params.id);
    if (course) {
        // update databse
        course = await Course.update(req.body, {where: {id: req.params.id}, runValidators: true});
        res.status(204).end()
    } else {
        res.status(404).json({
            message: "Course Not Found"
        })
    }
}));

// Delete course :id
router.delete('/courses/:id', asyncHandler(async (req, res, next) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        await course.destroy()

        res.status(204).end()
    } else {
        res.status(404).json({
            message: "Course Not Found"
        })
    }
}));

module.exports = router