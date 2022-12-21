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

    checkPostLike = async (postId, userId) => {
        const isLike = await this.likesRepository.checkPostLike(postId, userId);

        if (!isLike) {
            await this.likesRepository.createLike(postId, userId);
            return false;
        } else {
            await this.likesRepository.deleteLike(postId, userId);
            return true;
        }
    };
}

module.exports = LikesService;
