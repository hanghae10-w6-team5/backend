const LikesService = require('../services/likes.services');
const {
    InvalidParamsError,
    AuthenticationError,
} = require('../exception/index.exception.js');

class LikesController {
    constructor() {
        this.likesService = new LikesService();
    }

    checkPostLike = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const userId = res.locals.user;

            if (!userId)
                throw new AuthenticationError(
                    '로그인이 필요한 서비스입니다.',
                    403
                );

            if (!postId) {
                throw new InvalidParamsError(
                    '요청한 형식이 올바르지 않습니다.',
                    400
                );
            }

            const isLike = await this.likesService.checkPostLike(
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
