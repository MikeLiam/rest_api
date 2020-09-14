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
const colors = require('colors');
const helper = require('../helper');

// *Auth Route that returns the current authenticated user.
router.get('/users', authenticateUser, (req, res) => {
    const user = req.currentUser

    res.json({
        user
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
            console.log("Error inserting user".bgRed, err)
            res.status(400).json({
                message: {
                    ...err.errors.forEach(error => error.message)
                }
            })
        })


});

// get all courses
router.get('/courses', asyncHandler(async (req, res) => {

    const courses = await Course.findAll(helper.optionsFilterCourse);
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

    const course = await Course.findByPk(req.params.id, helper.optionsFilterCourse);

    if (course) {
        res.json(course)
    } else {
        res.status(404).json({
            message: "There are no courses"
        })
    }

}));

// *Auth create new course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {

    const course = await Course.create(req.body)
        .then(course => res.location(`/api/courses/${course.id}`))
    //.catch(err => console.log("Error inserting course".bgRed, err))

    res.status(201).end()

}));

// *Auth Update course :id
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        if (course.userId === req.currentUser.id) {
            const updated = await Course.update(req.body, {
                    where: {
                        id: req.params.id
                    },
                    individualHooks: true
                })
                .then(updated => {
                    // The promise returns an array with one or two elements. 
                    // The first element is always the number of affected rows,
                    return updated[0] !== 0
                })
            if (updated) {
                res.status(204).end()
            } else {
                res.status(404).json({
                    message: "No fields updated. Same previous values?"
                })
            }
        } else {
            res.status(403).json({
                message: "Current user doesn't own the requested course"
            })
        }
    } else {
        res.status(404).json({
            message: "Course Not Found"
        })
    }
}));

// *Auth Delete course :id
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res, next) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        if (course.userId === req.currentUser.id) {
            await course.destroy()

            res.status(204).end()
        } else {
            res.status(403).json({
                message: "Current user doesn't own the requested course"
            })
        }
    } else {
        res.status(404).json({
            message: "Course Not Found"
        })
    }
}));

module.exports = router