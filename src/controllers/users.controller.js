const UsersService = require('../services/users.service');
const {
    InvalidParamsError,
    AuthenticationError,
} = require('../exception/index.exception');

class UsersController {
    constructor() {
        this.UsersService = new UsersService();
    }

    // API to check if a duplicate id exists in Users table
    signUpDuplicateIdCheck = async (req, res, next) => {
        try {
            const id = req.params.id;

            if (!id) {
                throw new InvalidParamsError();
            }

            // call signUpDuplicateIdCheck method in service -> throws ValidationError if there is a duplicate id
            await this.UsersService.signUpDuplicateIdCheck(id);

            res.status(200).json({
                message: 'ID Validated',
            });
        } catch (err) {
            // pass err to errorHandler middleware
            next(err);
        }
    };

    // API for user signup
    signUpUser = async (req, res, next) => {
        try {
            const { id, password } = req.body;
            
            // check if id is included in password -> pw_check has a Boolean data type
            const pw_check = password.includes(id);

            if (!id || !password) {
                throw new InvalidParamsError();
            }

            if (pw_check) {
                throw new InvalidParamsError(
                    '패스워드에 id가 포함되어 있습니다.',
                    412
                );
            }

            // call signUpUser in service - create a user in Users table
            await this.UsersService.signUpUser(id, password);

            res.status(201).json({
                message: '회원가입에 성공하였습니다!',
            });
        } catch (err) {
            // pass err to errorHandler middleware
            next(err);
        }
    };

    // API for user login
    loginUser = async (req, res, next) => {
        try {
            const { id, password } = req.body;

            if (!id || !password) {
                throw new InvalidParamsError();
            }

            // call loginUser in service - log in with id and pw
            const token = await this.UsersService.loginUser(id, password);

            // return authentication: token -> to pass the token to client
            return res.status(200).json({
                authentication: token,
            });
        } catch (err) {
            // pass err to errorHandler middleware
            next(err);
        }
    };

    // API to get User Detail
    getUserDetail = async (req, res, next) => {
        try {
            const userId = res.locals.user;

            if (!userId) {
                throw new AuthenticationError(
                    '알 수 없는 오류가 발생했습니다.',
                    400
                );
            }
            
            // call getUserDetail to get user information using userID
            const target_user_detail = await this.UsersService.getUserDetail(
                userId
            );

            return res.status(200).json({
                data: target_user_detail,
            });
        } catch (err) {
            next(err);
        }
    };
}

module.exports = UsersController;
