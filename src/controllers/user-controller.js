const { StatusCodes } = require('http-status-codes')

const { UserService } = require("../services")
const { SuccessResponse, ErrorResponse } = require("../utils/commons")

/**
 * 
 * POST : /students
 * req.body {firstname: 'Madhur', lastname: 'Saxena', email: 'madhur.k20@iiits.in', password: 'madhur@2002', role: 'STUDENT'}
 */
async function registerUser(req, res) {
    try {
        const userData = {
            first_name: req.body.firstname,
            last_name: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        }
        const token = await UserService.registerUser(userData);
        SuccessResponse.data = token;
        res.setHeader('Authorization', 'Bearer ' + token);
        return res
            .status(StatusCodes.CREATED)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse)
    }
}

async function loginUser(req, res) {
    try {
        const userData = {
            email: req.body.email,
            password: req.body.password
        }
        const token = await UserService.loginUser(userData);
        SuccessResponse.data = token;
        res.setHeader('Authorization', 'Bearer ' + SuccessResponse.data);
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json(ErrorResponse);
    }
}

async function getFeed(req, res) {
    try {
        const journals = await UserService.getFeed(req.user);
        SuccessResponse.data = journals;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}

module.exports = {
    registerUser,
    loginUser,
    getFeed
}