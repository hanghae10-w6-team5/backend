const { Posts, Users, Comments, likes } = require('../models');

class PostsRepository extends Posts {
    constructor() {
        super();
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

    getOnePost = async (postId) => {
        const post = await Posts.findOne({
            where: { postId },
            include: [
                { model: Users, attributes: ['id'] },
                {
                    model: likes,
                    as: 'likes',
                    attributes: ['likeId'],
                },
            ],
        });
        return post;
    };

    getAllComment = async (postId) => {
        const Comment = await Comments.findAll({
            raw: true,
            where: { postId },
            attributes: ['commentId', 'comment', 'updatedAt'],
            order: [['createdAt', 'DESC']],
            include: [{ model: Users, attributes: ['id'] }],
        });
        return Comment;
    };
}

module.exports = PostsRepository;
