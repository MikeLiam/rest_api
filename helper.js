const auth = require('basic-auth')
const bcryptjs = require('bcryptjs')

// Get references to our models.
const {
    models
} = require('./db');
const {
    User,
} = models;

const {
    check,
    validationResult
} = require('express-validator')

const userFieldsValidator = [
    check('firstName')
    .exists({
        checkNull: true,
        checkFalsy: true
    })
    .withMessage('Please provide a value for "firstName"'),
    check('lastName')
    .exists({
        checkNull: true,
        checkFalsy: true
    })
    .withMessage('Please provide a value for "lastName"'),
    check('emailAddress')
    .exists({
        checkNull: true,
        checkFalsy: true
    })
    .withMessage('Please provide a value for "emailAddress"')
    .if(check('emailAddress').notEmpty())
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid emailAddress'),
    check('password')
    .exists({
        checkNull: true,
        checkFalsy: true
    })
    .withMessage('Please provide a value for "password"'),
]

function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}

const authenticateUser = async (req, res, next) => {
    /**
     * Destructuring assignment to filter properties from a given user
     * @param {Object} user 
     */
    function filterUser(user) {
        return (({
            id,
            emailAddress,
            firstName,
            lastName
        }) => ({
            id,
            emailAddress,
            firstName,
            lastName
        }))(user)
    }

    let message = null;

    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req)
    // If the user's credentials are available...
    if (credentials) {
        // Attempt to retrieve the user from the data store
        // by their username (i.e. the user's "key"
        // from the Authorization header).

        const users = await User.findOne({
            where: {
                emailAddress: credentials.name
            }
        })
        const user = users.dataValues
        // If a user was successfully retrieved from the data store...
        if (user) {
            // Use the bcryptjs npm package to compare the user's password
            // (from the Authorization header) to the user's password
            // that was retrieved from the data store.
            const authenticated = bcryptjs
            .compareSync(credentials.pass, user.password)
            // If the passwords match...
            if (authenticated) {
                // Then store the retrieved user object on the request object
                // so any middleware functions that follow this middleware function
                // will have access to the user's information.
                req.currentUser = filterUser(user)
                console.log("getting user: ".bgYellow, req.currentUser)
            } else {
                message = `Authentication failure for username: ${user.emailAddress}`;
            }
        } else {
            message = `User not found for username: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }
    // If user authentication failed...
    if (message) {
        console.warn(message);

        // Return a response with a 401 Unauthorized HTTP status code.
        res.status(401).json({
            message: 'Access Denied'
        });
    } else {
        // Or if user authentication succeeded...
        // Call the next() method.
        next();
    }

};

// Object with options to filter course properties to retrieve from database
const optionsFilterCourse = {
    attributes: {
        exclude: ['createdAt', 'updatedAt']
    },
    include: [{
        model: User,
        as: 'createdBy',
        attributes: {
            exclude: ['password', 'createdAt', 'updatedAt']
        }
    }, ]
}

module.exports = {
    userFieldsValidator,
    asyncHandler,
    authenticateUser,
    optionsFilterCourse
}