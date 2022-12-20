const PostsRepository = require('../repositories/posts.repository');
const { InvalidParamsError, ValidationError, AuthenticationError } = require('../exceptions/index.exception.js');

class PostsService {
    constructor() {
        this.postsRepository = new PostsRepository();
    }

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
    return data.postId;
};


  getOnePost = async (postId) => {
      try {
          const post = await this.postsRepository.getOnePost(postId);
          const Comment = await this.postsRepository.getAllComment(postId);
          if (!post)
              throw ValidationError('해당 게시글을 찾을 수 없습니다.', 404);

          let comments = [];
          if (Comment.length !== 0) {
              Comment.forEach((c) => {
                  comments.push({
                      commentId: c.commentId,
                      id: c['User.id'],
                      comment: c.comment,
                      updatedAt: c.updatedAt,
                  });
              });
          }
          return {
              data: {
                  postId: post.postId,
                  id: post.id,
                  title: post.title,
                  detail: post.detail,
                  price: post.price,
                  thumbnail: post.thumbnail,
                  createdAt: post.createdAt,
                  updatedAt: post.updatedAt,
                  likes: post.likes.length,
                  comments,
              },
          };
      } catch (error) {
          throw error;
      }
  };
}


module.exports = PostsService;
