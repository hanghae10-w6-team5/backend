const { Posts, Users, Comments, likes } = require('../models/');
class PostsRepository {
    constructor() {
        this.postsModel = Posts;
        this.usersModel = Users;
        this.commentsModel = Comments;
        this.likesModel = likes;
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

    getOnePost = async (postId) => {
        const post = await this.postsModel.findOne({
            where: { postId },
            include: [
                { model: this.usersModel, attributes: ['id'] },
                {
                    model: this.likesModel,
                    as: 'likes',
                    attributes: ['likeId'],
                },
                {
                    model: this.commentsModel,
                    as: 'Comments',
                    attributes: ['commentId', 'comment', 'updatedAt'],
                    order: [['updatedAt', 'DESC']],
                    include: [{ model: this.usersModel, attributes: ['id'] }],
                },
            ],
        });
        return post;
    };

    updatePost = async (userId, postId, title, detail, price, thumbnail) => {
        const post = await this.postsModel.update(
            { title, detail, price, thumbnail },
            { where: { postId, userId } }
        );
        return post;
    };

    deletePost = async (userId, postId) => {
        return await this.postsModel.destroy({
            where: { userId, postId },
        });

        return deletePost;
    };

    findPost = async (postId) => {
        const existPost = await this.postsModel.findOne({
            where: { postId },
        });

        return existPost;
    };
}

module.exports = PostsRepository;
