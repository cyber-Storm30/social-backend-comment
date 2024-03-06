import CommentService from "../services/comment.service.js";

class CommentController {
  async createPostComment(req, res) {
    try {
      const comment = await CommentService.createPostComment(req.body);
      return res.status(200).json({
        success: true,
        data: comment,
        message: "Create comment succesfull",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  async getPostComments(req, res) {
    try {
      const comments = await CommentService.getPostComments(req.params.id);
      return res.status(200).json({
        success: true,
        data: comments,
        message: "Comments fetched succesfully",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  async likeComment(req, res) {
    try {
      const { userId, commentId } = req.body;
      const likeStatus = await CommentService.likeComment(userId, commentId);
      return res.status(200).json(likeStatus);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new CommentController();
