const UsersService = require('../services/users.service')
const { InvalidParamsError, AuthenticationError } = require('../exception/index.exception');

class UsersController {
    constructor () {
        this.UsersService = new UsersService();
    }
    
    signUpDuplicateIdCheck = async (req, res, next) => {
        try {
            const id = req.params.id;
            
            if (!id) {
                throw new InvalidParamsError;
            }

            await this.UsersService.signUpDuplicateIdCheck(id);

            res.status(200).json({
                message: "ID Validated"
            });
        } catch (err) {
            next(err);
        }
    }

    signUpUser = async (req, res, next) => {
        try {
            const { id, password } = req.body;
            const pw_check = password.includes(id);
            
            if (!id || !password) {
                throw new InvalidParamsError;
            }
            
            if (pw_check) {
                throw new InvalidParamsError('패스워드에 id가 포함되어 있습니다.', 412);
            }

            await this.UsersService.signUpUser(id, password);

            res.status(201).json({
                message: "회원가입에 성공하였습니다!"
            });
        } catch (err) {
            next(err);
        }
    }

    loginUser = async (req, res, next) => {
        try {
            const { id, password } = req.body;

            if (!id || !password) {
                throw new InvalidParamsError;
            }

            const token = await this.UsersService.loginUser(id, password);

            return res.status(200).json({
                authorization: token
            })
        } catch (err) {
            next(err);
        }
    }

    getUserDetail = async (req, res, next) => {
        try {
            const userId = res.locals.user;

            if (!userId) {
                throw new AuthenticationError('알 수 없는 오류가 발생했습니다.', 400);
            }

            const target_user_detail = await this.UsersService.getUserDetail(userId);

            return res.status(200).json({
                data: target_user_detail
            });
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = UsersController 