const { ENUMS } = require('../utils/commons')

const USER_TYPE = ENUMS.USER_TYPE;

class User {
    constructor(id, firstName, lastName, email, password) {
        this.first_name = firstName;
        this.last_name = lastName;
        this.email = email;
        this.password = password;
        this.role = USER_TYPE;
    }
}

module.exports = User;