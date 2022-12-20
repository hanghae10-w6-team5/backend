const UsersRepository = require('../repositories/users.repository');
const { Users } = require('../models');
const {
    AuthenticationError,
    ValidationError,
} = require('../exception/index.exception');
const { hash } = require('../util/auth-encryption.util');
const { createToken } = require('../util/auth-jwtToken.util');

class UsersService {
    constructor() {
        this.usersRepository = new UsersRepository(Users);
    }

    signUpDuplicateIdCheck = async (id) => {
        const target_user = await this.usersRepository.findUser(id);
        if (target_user) {
            throw new ValidationError('이미 사용 중인 id 입니다.', 412);
        }

        return target_user;
    };

    signUpUser = async (id, password) => {
        const hashed_pw = hash(password);
        const newUser = await this.usersRepository.createUser(id, hashed_pw);

        if (!newUser) {
            throw new ValidationError();
        }

        return newUser;
    };

    loginUser = async (id, password) => {
        const target_user = await this.usersRepository.findUser(id);
        const hashed_pw = hash(password);

        if (!target_user || target_user.password !== hashed_pw) {
            throw new ValidationError('id 또는 비밀번호가 틀렸습니다.', 401);
        }

        // Now, just passing the access token - subject to be fixed with a refresh token - using helper function
        const token = createToken(target_user.userId, '1h');
        return token;
    };
}

module.exports = UsersService;
