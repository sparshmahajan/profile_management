const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const { dataValidator } = require('../middlewares/dataValidator');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { signup, login, viewUsers, updateUser,addUser } = require('../controllers/user.controller');


router.post('/signup',
    body('email', 'Email is required').not().isEmpty(),
    body('email', 'Email is invalid').isEmail().normalizeEmail(),
    body('password', 'Password is required').not().isEmpty(),
    body('password', 'Password must be more than 6 characters').isLength({ min: 6 }),
    body('password', 'Password must be less than 13 characters').isLength({ max: 12 }),
    body('password', 'Password and Confirm Password must match').custom((value, { req }) => value === req.body.confirmPassword),
    body('firstName', 'First Name is required').not().isEmpty(),
    body('lastName', 'Last Name is required').not().isEmpty(),
    body('role', 'Role is required').not().isEmpty(),
    dataValidator, signup);

router.post('/login', 
    body('email', 'Email is required').not().isEmpty(),
    body('email', 'Email is invalid').isEmail().normalizeEmail(),
    body('password', 'Password is required').not().isEmpty(),
    dataValidator, login);

router.get('/', authMiddleware, viewUsers);

router.patch('/', authMiddleware, updateUser);

router.post('/add', authMiddleware, 
    body('email', 'Email is required').not().isEmpty(),
    body('email', 'Email is invalid').isEmail().normalizeEmail(),
    body('password', 'Password is required').not().isEmpty(),
    body('password', 'Password must be more than 6 characters').isLength({ min: 6 }),
    body('password', 'Password must be less than 13 characters').isLength({ max: 12 }),
    body('password', 'Password and Confirm Password must match').custom((value, { req }) => value === req.body.confirmPassword),
    body('firstName', 'First Name is required').not().isEmpty(),
    body('lastName', 'Last Name is required').not().isEmpty(),
    body('role', 'Role is required').not().isEmpty(),
    dataValidator, addUser);

module.exports = router;