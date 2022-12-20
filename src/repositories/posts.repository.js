const { Posts, Users } = require('../models');

class PostsRepository {
    constructor() {
        this.postsModel = new Posts();
        this.usersModel = new Users();
    }

    createPost = async (userId, title, price, detail, thumbnail) => {
        return this.postsModel.create({
            userId,
            title,
            price,
            detail,
            thumbnail,
        });
    };

    findAllPost = async () => {
        return await this.postsModel.findAll({
            include: { model: this.usersModel, attributes: ['id'] },
        });
    };
}

module.exports = PostsRepository;
