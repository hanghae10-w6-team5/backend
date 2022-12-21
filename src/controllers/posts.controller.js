const PostsService = require('../services/posts.service');
const {
    InvalidParamsError,
    ValidationError,
    AuthenticationError,
} = require('../exception/index.exception.js');

class PostsController {
    constructor() {
        this.postsService = new PostsService();
    }

    postLookup = async (req, res, next) => {
        try {
            const posts = await this.postsService.findAllPost();

            if (!posts) throw new ValidationError();
            res.status(200).json({ data: posts });
        } catch (error) {
            next(error);
        }
    };

    createPost = async (req, res, next) => {
        try {
            const { title, price, detail, thumbnail } = req.body;
            const userId = res.locals.user;

            if (!userId) {
                throw new AuthenticationError(
                    '로그인이 필요한 서비스입니다',
                    403
                );
            }

            if (!title || !price || !detail)
                throw new InvalidParamsError(
                    '요청한 데이터 형식이 올바르지 않습니다',
                    400
                );

            if (typeof title !== 'string' || typeof detail !== 'string')
                throw new InvalidParamsError(
                    '요청한 데이터 형식이 올바르지 않습니다',
                    400
                );

            if (typeof price !== 'number')
                throw new InvalidParamsError(
                    '요청한 데이터 형식이 올바르지 않습니다',
                    400
                );

            const post = await this.postsService.createPost(
                userId,
                title,
                price,
                detail,
                thumbnail
            );

            if (!post) throw new ValidationError();

            res.status(201).json({ postId: post });
        } catch (err) {
            next(err);
        }
    };

    getOnePost = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const post = await this.postsService.getOnePost(postId);

            if (!post) throw new ValidationError();

            if (!postId) {
                throw new InvalidParamsError(
                    '해당 게시글을 찾을 수 없습니다.',
                    400
                );
            }

            res.status(200).json({ data: post });
        } catch (error) {
            next(error);
        }
    };

    updatePost = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const { title, detail, price, thumbnail } = req.body;
            const userId = res.locals.user;

            const updatePost = await this.postsService.updatePost(
                userId,
                postId,
                title,
                detail,
                price,
                thumbnail
            );

            if (!postId) {
                throw new InvalidParamsError(
                    '해당 게시글을 찾을 수 없습니다.',
                    400
                );
            }

            if (!userId) {
                throw new AuthenticationError(
                    '로그인이 필요한 서비스 입니다.',
                    403
                );
            }

            if (!title || !detail || !price) {
                throw new InvalidParamsError(
                    '요청한 데이터 형식이 올바르지 않습니다.',
                    400
                );
            }

            res.status(200).json({ data: updatePost });
        } catch (error) {
            next(error);
        }
    };

    deletePost = async (req, res, next) => {
        try {
            const userId = res.locals.user;

            const { postId } = req.params;

            if (!postId) {
                throw new InvalidParamsError(
                    '해당 게시글을 찾을 수 없습니다.',
                    400
                );
            }

            if (!userId) {
                throw new AuthenticationError(
                    '로그인이 필요한 서비스 입니다.',
                    403
                );
            }

            await this.postsService.deletePost(userId, postId);

            res.status(200).json({ message: '게시글을 삭제 하였습니다.' });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = PostsController;
