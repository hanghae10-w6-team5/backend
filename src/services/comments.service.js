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

        const commentWithId = await this.commentsRepository.findComment(
            newComment.commentId
        );

        // 생성된 댓글과 작성한 유저 정보를 컨트롤러에 전달
        return {
            id: commentWithId['User.id'],
            comment: commentWithId.comment,
            updatedAt: commentWithId.updatedAt,
        };
    };

    editComment = async (postId, commentId, userId, comment) => {
        const commentData = await this.commentsRepository.findComment(
            commentId
        );

        if (!commentData) {
            throw new ValidationError('해당 댓글을 찾을 수 없습니다.', 404);
        } else if (commentData.postId !== postId) {
            throw new ValidationError('해당 게시글을 찾을 수 없습니다.', 404);
        } else if (commentData.userId !== userId) {
            throw new AuthenticationError('권한이 없는 유저입니다.', 404);
        }

        const editCommentData = await this.commentsRepository.updateComment(
            postId,
            commentId,
            userId,
            comment
        );

        if (!editCommentData) throw new ValidationError();

        const updateComment = await this.commentsRepository.findComment(
            commentId
        );

        console.log(updateComment);
        return {
            updateComment: updateComment.comment,
            updatedAt: updateComment.updatedAt,
        };
    };
}

module.exports = CommentsService;
