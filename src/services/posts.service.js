const PostsRepository = require('../repositories/posts.repository');
const { InvalidParamsError } = require('../exceptions/index.exception.js');

class PostsService {
    constructor() {
        this.postsRepository = new PostsRepository();
    }

    // 에러처리 { InvalidParamsError, ValidationError, AuthenticationError } = require('index.exception.js의 상대 경로')

    findAllPost = async () => {
        // 저장소(Repository)에게 데이터를 요청합니다.
        const allPost = await this.postsRepository.findAllPost();

        // 호출한 Post들을 가장 최신 게시글 부터 정렬합니다.
        allPost.sort((a, b) => {
            return b.updatedAt - a.updatedAt;
        });

        // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
        return allPost.map((post) => {
            return {
                data: {
                    postId: post.postId,
                    id: post.Users.id,
                    title: post.title,
                    price: post.price,
                    thumbnail: post.thumbnail,
                    updatedAt: post.updatedAt,
                },
            };
        });
    };
}

createPost = async (userId, title, price, detail, thumbnail) => {
    const data = await this.postsRepository.createPost(
        userId,
        title,
        price,
        detail,
        thumbnail
    );
    //만약 데이터 값이 없으면 null , err 400번을 던짐
    if (!data) throw InvalidParamsError();
};
return data.postId;

module.exports = PostsService;
