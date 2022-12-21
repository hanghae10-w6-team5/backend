const LikesRepository = require('../repositories/likes.repository');
const {
    InvalidParamsError,
    ValidationError,
    AuthenticationError,
} = require('../exception/index.exception');

class LikesService {
    constructor() {
        this.likesRepository = new LikesRepository();
    }

    createPostLike = async (postId, userId) => {
        const existLike = await this.likesRepository.createPostLike(
            postId,
            userId
        );

        if (!existLike) {
            await this.likesRepository.createLike(postId, userId);
        } else {
            await this.likesRepository.deleteLike(postId, userId);
        }

        return existLike;
    };
}

module.exports = LikesService;
