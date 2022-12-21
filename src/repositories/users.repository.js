const { Op } = require("sequelize");

class UsersRepository {
    // instance variable of UsersRepository class
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields
    #usersModel;
    constructor (UsersModel) {
        this.#usersModel = UsersModel;
    }

    // find a user based on id
    findUser = async (id) => {
        const target_user = await this.#usersModel.findOne({
            where: {
                id
            }
        })
        return target_user;
    }
    
    // create a user
    createUser = async (id, password) => {
        return await this.#usersModel.create({
            id,
            password
        });
    }
  
    // find a user based on userId
    findUserByUserId = async (userId) => {
        const target_user = await this.#usersModel.findOne({
            where: {
                userId
            }
        })
        return target_user;
    }
}

module.exports = UsersRepository;