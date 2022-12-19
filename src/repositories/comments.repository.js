const { Op } = require('sequelize');
const {
    ValidationError,
    AuthenticationError,
} = require('../exception/index.exception');

class CommentsRepository {
    // 레포지토리는 db와 직접 연결되어 있으므로, 외부에서 데이터 모델인 멤버변수에 접근하지 못하게 private으로 선언
    #commentsModel;
    #usersModel;
    constructor(CommentsModel, UsersModel) {
        this.#commentsModel = CommentsModel;
        this.#usersModel = UsersModel;
    }

    // db에 새로운 댓글 생성을 위한 메서드
    createComment = async ({ postId, userId, comment }) => {
        // db에 새로운 댓글 저장
        const { commentId } = await this.#commentsModel.create({
            postId,
            userId,
            comment,
        });

        // db에서 방금 저장한 댓글의 commentId를 이용해 댓글을 작성한 유저 정보 불러오기
        return await this.#commentsModel.findOne({
            where: { commentId },
            include: {
                nested: true,
                model: this.#usersModel,
                as: 'User',
                attributes: ['id'],
            },
            attributes: ['comment', 'updatedAt'],
            raw: true,
        });
    };

    updateComment = async (postId, commentId, userId, comment) => {
        const commentData = await this.#commentsModel.findOne({
            where: { commentId },
            raw: true,
        });
        console.log('repo:', commentData);
        if (!commentData) {
            throw new ValidationError('해당 댓글을 찾을 수 없습니다.', 404);
        } else if (commentData.postId !== postId) {
            throw new ValidationError('해당 게시글을 찾을 수 없습니다.', 404);
        } else if (commentData.userId !== userId) {
            throw new AuthenticationError('권한이 없는 유저입니다.', 404);
        }

        const editComment = await this.#commentsModel.update(
            { comment },
            {
                where: {
                    [Op.and]: [{ commentId }, { userId }],
                },
            }
        );
        return editComment;
    };
}

module.exports = CommentsRepository;
