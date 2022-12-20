const { Op } = require('sequelize');

class CommentsRepository {
    // 레포지토리는 db와 직접 연결되어 있으므로, 외부에서 데이터 모델인 멤버변수에 접근하지 못하게 private으로 선언
    #commentsModel;
    #usersModel;
    constructor(CommentsModel, UsersModel) {
        this.#commentsModel = CommentsModel;
        this.#usersModel = UsersModel;
    }

    findComment = async (commentId) => {
        return await this.#commentsModel.findOne({
            where: { commentId },
            include: {
                nested: true,
                model: this.#usersModel,
                as: 'User',
                attributes: ['id'],
            },
            raw: true,
        });
    };

    // db에 새로운 댓글 생성을 위한 메서드
    createComment = async ({ postId, userId, comment }) => {
        // db에 새로운 댓글 저장
        return await this.#commentsModel.create({
            postId,
            userId,
            comment,
        });
    };

    updateComment = async (commentId, userId, comment) => {
        return await this.#commentsModel.update(
            { comment },
            {
                where: {
                    [Op.and]: [{ commentId }, { userId }],
                },
            }
        );
    };

    deleteComment = async (commentId, userId) => {
        return await this.#commentsModel.destroy({
            where: {
                [Op.and]: [{ commentId }, { userId }],
            },
        });
    };
}

module.exports = CommentsRepository;
