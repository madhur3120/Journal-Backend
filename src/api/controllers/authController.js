const User = require('../../models/user')
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const connection = require('../../config/db')

const SignToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: 2 * 60 * 60 * 1000,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = SignToken(user.id);
    user.password = undefined;
    return res.status(statusCode).json({
        status: `OK`,
        token: token,
        data: {
            user,
        },
    });
};

exports.signup = async (req, res, next) => {
    try {
        const { firstname, lastname, email, password, role } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        connection.query('SELECT * FROM Users WHERE email = ?', [email], async (error, results) => {
            if (error) throw error;
            if (results.length) {
                return res.status(422).json({ error: 'Email already exists' });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = { firstname, lastname, email, role, password: hashedPassword };
                connection.query('INSERT INTO Users SET ?', user, (error, results) => {
                    if (error) throw error;
                    user.id = results.insertId;  // Get the id of the newly created user
                    createSendToken(user, 201, res);
                });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

exports.signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password!' });
        }

        connection.query('SELECT * FROM Users WHERE email = ?', [email], async (error, results) => {
            if (error) throw error;

            // Check if user exists and password is correct
            if (results.length && await bcrypt.compare(password, results[0].password)) {
                // If everything is okay, send token to client
                const user = results[0];
                createSendToken(user, 200, res);
            } else {
                return res.status(401).json({ error: 'Incorrect email or password' });
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Server error' });
    }
};
exports.signout = (req, res, next) => {
    res.cookie("jwt", "", {
        expires: new Date(Date.now() + 5 * 1000),
        // httpOnly: true,
    });
    return res.status(200).json({ status: "OK" });
};
