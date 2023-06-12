const CommentService = require("../services/comment.service.js");
// const PostsService = require("../(2)services/posts.service.js");

class CommentController {
    commentService = new CommentService();
    // postsService = new PostsService();

    // 댓글 생성
    createComment = async (req, res, next) => {
        try {
            const { userId } = res.locals.user;
            const { postId } = req.params;
            const {
                comment,
                isPrivate,
                // commentLatitude, 
                // commentLongitude 
            } = req.body;
            const { commentPhotoUrl } = req;

            if (!comment) {
                throw new Error("403/댓글 작성에 실패하였습니다.");
            }

            // 게시글이 존재하는지 여부 확인
            const post = await this.commentService.findPostById(postId);

            if (!post) {
                throw new Error("403/게시물이 존재하지 않습니다");
            }

            await this.commentService.createComment(
                userId,
                postId,
                comment,
                commentPhotoUrl,
                isPrivate,
                // commentLatitude, 
                // commentLongitude
            );

            res.status(201).json({ message: "댓글을 작성하였습니다." });
        } catch (error) {
            error.failedApi = "댓글 생성";
            next(error);
        }
    };

    // 전체 댓글 조회
    readComments = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const userId = res.locals.user ? res.locals.user.userId : null; // 로그인을 했을 때와 로그인을 하지 않았을 때의 사용자 구분
            // const { userId } = res.locals.user || {}; // 위랑 똑같

            const post = await this.commentService.findPostById(postId);
            if (!post) {
                throw new Error("403/게시물이 존재하지 않습니다.");
            }

            // 댓글이 존재하는지 여부 확인
            const comments = await this.commentService.findCommentsByPostId(postId, userId);
            if (!comments) {
                throw new Error("403/댓글이 존재하지 않습니다.");
            }

            return res.status(200).json({ commentsData: comments });
        } catch (error) {
            error.failedApi = "댓글 조회";
            next(error);
        }
    };

    // 댓글 수정
    fixComment = async (req, res, next) => {
        try {
            const { userId } = res.locals.user;
            const { postId, commentId } = req.params;
            const { comment } = req.body;

            const post = await this.commentService.findPostById(postId);
            if (!post) {
                throw new Error("403/게시물이 존재하지 않습니다.");
            }

            const comments = await this.commentService.findCommentById(commentId);
            if (!comments) {
                throw new Error("403/댓글이 존재하지 않습니다.");
            }

            await this.commentService.updateComment(userId, postId, commentId, comment);

            return res.status(200).json({ message: "댓글을 수정하였습니다." });
        } catch (error) {
            error.failedApi = "댓글 수정";
            next(error);
        }
    }

    // 댓글 삭제
    deleteComment = async (req, res, next) => {
        try {
            const { userId } = res.locals.user;
            const { postId, commentId } = req.params;

            const post = await this.commentService.findPostById(postId);
            if (!post) {
                throw new Error("403/게시물이 존재하지 않습니다.");
            }

            const comment = await this.commentService.findCommentById(commentId);
            if (!comment) {
                throw new Error("403/댓글이 존재하지 않습니다.");
            }

            if (comment.UserId !== userId) {
                throw new Error("403/댓글 삭제 권한이 존재하지 않습니다.");
            }

            await this.commentService.deleteComment(userId, postId, commentId);

            return res.status(200).json({ message: "댓글을 지웠습니다." });
        } catch (error) {
            error.failedApi = "댓글 삭제";
            next(error);
        }
    };
};

module.exports = CommentController;