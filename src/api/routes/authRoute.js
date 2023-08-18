const express = require(`express`);
const router = express.Router();

const { check } = require(`express-validator`);
const { signup, signin, signout } = require(`../controllers/authController`);

// @desc Register a User ( SignUp )
// @access Public
router.post(
    `/signup`,
    [
        check(`firstname`, `Firstname must be more than 2 char`).isLength({
            min: 3,
        }),
        check(`lastname`, `Lastname must be more than 2 char`).isLength({
            min: 3,
        }),
        check(`email`, `Invalid Email`).isEmail(),
        check(`role`, `Invalid Role`).isIn([`student`, `teacher`]),
        check(
            `password`,
            `Please enter a password at least 8 character 
                            and contain At least one uppercase.At least 
                            one lower case.At least one special character.`
        )
            .isLength({ min: 8 })
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/),
    ],

    signup
);

// @desc Sign In a User
// @access Public
router.post(
    `/signin`,
    [
        check(`email`, `Please include a valid email`).isEmail(),
        check(`password`, `Password is required`).exists()
    ],
    signin
);

// @desc SignOut a User ( Signout )
// @access Public
router.get(`/signout`, signout);

module.exports = router;
