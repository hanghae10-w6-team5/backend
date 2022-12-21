const LikesService = require('../services/likes.services');
const { InvalidParamsError } = require('../exception/index.exception.js');
const { ValidationError } = require('sequelize');
const { authenticate } = require('passport');

class LikesController {
    constructor() {
        this.likesService = new LikesService();
    }

    createPostLike = async (req, res, next) => {
        try {
            // const userId = res.locals.user;
            // const userId = 1;
            const userId = req.get('userId');
            const { postId } = req.params;

            if (!postId)
                throw new ValidationError(
                    '요청한 형식이 올바르지 않습니다.',
                    400
                );
            if (!userId)
                throw new InvalidParamsError(
                    '로그인이 필요한 서비스입니다.',
                    403
                );

            const isLike = await this.likesService.createPostLike(
                postId,
                userId
            );

            if (isLike) {
                return res
                    .status(200)
                    .json({ message: '게시글 찜하기를 취소했습니다.' });
            }

            res.status(201).json({
                message: '게시글을 찜했습니다.',
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = LikesController;
