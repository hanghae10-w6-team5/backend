const CommentsService = require('../services/comments.service');
const {
    InvalidParamsError,
    ValidationError,
    AuthenticationError,
} = require('../exception/index.exception');
const { validateToken } = require('../util/auth-jwtToken.util');

class CommentsController {
    constructor() {
        this.commentsService = new CommentsService();
    }

    createComment = async (req, res, next) => {
        try {
            // 클라에서 전달받은 req 값을 구조분해 할당
            const { postId } = req.params;
            const token = req.get('authentication');
            const userId = validateToken(token);
            // res.locals.user
            const { comment } = req.body;

            // 값을 검증하고, 상황에 맞는 에러객체에 메세지와 status code를 포함하여 에러 처리
            if (!userId) {
                throw new AuthenticationError();
            }
            if (!postId) {
                throw new InvalidParamsError(
                    '해당 게시글이 존재하지 않습니다.',
                    404
                );
            } else if (!comment || typeof comment !== 'string') {
                throw new InvalidParamsError();
            }

            // 검증이 완료된 데이터를 db에 저장
            const newComment = await this.commentsService.createComment({
                postId: Number(postId),
                userId,
                comment,
            });

            // 댓글 저장 성공시, 클라로 새로 추가한 댓글 정보 전달
            res.status(201).json({ data: newComment });
        } catch (err) {
            next(err);
        }
    };

    updateComment = async (req, res, next) => {
        try {
            const { postId, commentId } = req.params;
            const token = req.get('authentication');
            const userId = validateToken(token);
            //res.locals.user
            const { comment } = req.body;

            if (!comment || typeof comment !== 'string') {
                throw new InvalidParamsError();
            } else if (!userId) {
                throw new AuthenticationError(
                    '로그인이 필요한 서비스입니다.',
                    403
                );
            }

            const editComment = await this.commentsService.editComment(
                Number(postId),
                Number(commentId),
                userId,
                comment
            );
            res.status(200).json(editComment);
        } catch (err) {
            next(err);
        }
    };

    deleteComment = async (req, res, next) => {
        try {
            const { postId, commentId } = req.params;
            const token = req.get('authentication');
            const userId = validateToken(token);
            //res.locals.user

            if (!userId) {
                throw new AuthenticationError(
                    '로그인이 필요한 서비스입니다.',
                    403
                );
            }

            await this.commentsService.deleteComment(
                Number(postId),
                Number(commentId),
                userId
            );

            res.status(200).json({ message: '댓글이 삭제되었습니다.' });
        } catch (err) {
            next(err);
        }
    };
}

module.exports = CommentsController;
