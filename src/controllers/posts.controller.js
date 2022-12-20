const PostsService = require('../services/posts.service');

class PostsController {
    constructor() {
        this.postsService = new PostsService();
    }

    //전체조회

    postLookup = async (req, res, next) => {
        try {
            const posts = await this.postsService.findAllPost();
            res.status(200).json({ data: posts });
        } catch (error) {
            next(error); //에러 핸들링했기때문에 에러를 던진다 -> app.js
        }
    };

    //글작성하기

    createPost = async (req, res, next) => {
        try {
            const { title, price, detail, thumbnail } = req.body;
            const { usersId } = req.header;
            //const userId = res.locals.user;

            const posts = await this.postsService.createPost(
                usersId,
                title,
                price,
                detail,
                thumbnail
            );

            res.status(201).json({ postId: posts });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = PostsController;
