const CommentsRepository = require('../repositories/comments.repository.js');
const { Comments, Users, Posts } = require('../models');
const { ValidationError } = require('../exception/index.exception');

class CommentsService {
    // 데이터 모델을 Repository에 생성자 주입 방식을 이용해 의존성 주입
    constructor() {
        this.commentsRepository = new CommentsRepository(
            Comments,
            Users,
            Posts
        );
    }

    // 댓글 생성을 위해 사용하는 메서드
    createComment = async ({ postId, userId, comment }) => {
        // 전달받은 값을 이용해 db에 댓글 생성
        const newComment = await this.commentsRepository.createComment({
            postId,
            userId,
            comment,
        });
        // 만약, newComment가 null이면, 에러를 던짐
        if (!newComment) throw new ValidationError();

        // 생성된 댓글과 작성한 유저 정보를 컨트롤러에 전달
        return {
            id: newComment['User.id'],
            comment: newComment.comment,
            updatedAt: newComment.updatedAt,
        };
    };

    updateComment = async (postId, commentId, userId, comment) => {
        const editComment = await this.commentsRepository.updateComment(
            postId,
            commentId,
            userId,
            comment
        );

        if (!editComment) throw new ValidationError();
        return comment;
    };
}

module.exports = CommentsService;
