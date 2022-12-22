const UsersRepository = require("../repositories/users.repository");
const { Users } = require('../models');
const { AuthenticationError, ValidationError } = require("../exception/index.exception");
const { hash } = require('../util/auth-encryption.util');
const { tokenObject, createToken } = require('../util/auth-jwtToken.util');

class UsersService {
    constructor() {
        this.usersRepository = new UsersRepository(Users);
    }

    // throws ValidationError if there is a duplicate id
    signUpDuplicateIdCheck = async (id) => {
        const target_user = await this.usersRepository.findUser(id);
        if (target_user) {
            throw new ValidationError('이미 사용 중인 id 입니다.', 412);
        }
    }

    // signUpUser with a hashed password - create a user in Users table
    signUpUser = async (id, password) => {
        const hashed_pw = hash(password);
        const newUser = await this.usersRepository.createUser(id, hashed_pw);

        if (!newUser) {
            throw new ValidationError;
        }
    }

    // loginUser - find if there is a user with a given id
    loginUser = async (id, password) => {
        // find a user from Users table using id
        const target_user = await this.usersRepository.findUser(id);
        const hashed_pw = hash(password);

        if (!target_user || target_user.password !== hashed_pw) {
            throw new ValidationError('id 또는 비밀번호가 틀렸습니다.', 401)
        }

        // Now, just passing the access token - subject to be fixed with a refresh token - using helper function
        const token = createToken(target_user.userId, '1h');
        return token;
    }

    // getUserDetail - find if there is a user with a given userId
    getUserDetail = async (userId) => {
        // find a user from Users table using userId
        const target_user = await this.usersRepository.findUserByUserId(userId);

        if (!target_user) {
            throw new ValidationError;
        }

        // construct a new object user_detail
        const user_detail = {
            id: target_user.id,
            createdAt: target_user.createdAt
        }

        return user_detail;
    }

}

module.exports = UsersService;