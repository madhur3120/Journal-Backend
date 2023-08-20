const { StatusCodes } = require("http-status-codes");
const { UserRepository, JournalStudentMappingRepository, JournalRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const bcrypt = require('bcrypt');

const userRepository = new UserRepository();
const journalStudentMappingRepository = new JournalStudentMappingRepository();
const journalRepository = new JournalRepository();

const { JWT, ENUMS } = require('../utils/commons')
const { generateToken } = JWT
const { USER_TYPE } = ENUMS

async function loginUser(data) {
    try {
        const user = await userRepository.findByEmail(data.email);
        if (!user) {
            throw new AppError('User not found', StatusCodes.NOT_FOUND);
        }
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new AppError('Invalid password', StatusCodes.UNAUTHORIZED);
        }
        const token = generateToken(user.id);
        return token;
    } catch (error) {
        let message = 'Login Error';
        if (error) {
            message = error.message;
        }
        throw new AppError(message, error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function registerUser(data) {
    try {
        const token = await userRepository.register(data);
        return token;
    } catch (error) {
        message = 'Could not register user';
        if (error) {
            message = error.message;
        }
        throw new AppError(message, StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function getFeed(user_data) {
    try {
        if (user_data.role === USER_TYPE.STUDENT) {
            const journals = userRepository.getStudentFeed({ student_id: user_data.id })
            return journals;
        } else if (user_data.role === USER_TYPE.TEACHER) {
            const journals = userRepository.getTeacherFeed({ teacher_id: user_data.id });
            return journals;
        }
    } catch (error) {
        message = 'Cannot obtain Feed for the user';
        if (error) {
            message = error.message;
        }
        throw new AppError(message, StatusCodes.NOT_FOUND)
    }
}


module.exports = {
    registerUser,
    loginUser,
    getFeed
}