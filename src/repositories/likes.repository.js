const { Op } = require('sequelize');
const { likes } = require('../models/');

class LikesRepository {
    constructor() {
        this.likesModel = likes;
    }

    createPostLike = async (postId, userId) => {
        return this.likesModel.findOne({
            where: {
                [Op.and]: [{ postId }, { userId }],
            },
        });
    };

    createLike = async (postId, userId) => {
        return this.likesModel.create({
            postId,
            userId,
        });
    };

    deleteLike = async (postId, userId) => {
        return this.likesModel.destroy({
            where: {
                [Op.and]: [{ postId }, { userId }],
            },
        });
    };
}

module.exports = LikesRepository;
