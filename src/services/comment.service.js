import CommentModel from "../models/comment.model.js";
import axios from "axios";
import { BASE_URL } from "../config/connection.js";
import kafka from "../config/kafkaClient.js";

class CommentService {
  async createPostComment(payload) {
    try {
      const comment = new CommentModel(payload);
      await comment.save();
      const response = await axios.post(`${BASE_URL}/post/add/comment`, {
        commentId: comment._id,
        postId: payload.postId,
      });
      const userResponse = await axios.get(
        `${BASE_URL}/auth/user/${comment.userId}`
      );
      const userDetails = userResponse.data.data;
      const commentWithUser = {
        ...comment.toObject(),
        userId: userDetails,
      };
      return commentWithUser;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }
  async getPostComments(id) {
    try {
      const comments = await CommentModel.find({ postId: id }).sort({
        createdAt: -1,
      });
      const commentWithUerDetails = Promise.all(
        comments.map(async (comment) => {
          console.log(comment);
          try {
            const userResponse = await axios.get(
              `${BASE_URL}/auth/user/${comment.userId}`
            );
            const userDetails = userResponse.data.data;
            const commentWithUserDetails = {
              ...comment.toObject(),
              userId: userDetails,
            };
            return commentWithUserDetails;
          } catch (err) {
            return comment;
          }
        })
      );
      return commentWithUerDetails;
    } catch (err) {
      throw new Error(err);
    }
  }
  async likeComment(userId, commentId) {
    try {
      const comment = await CommentModel.findById(commentId);
      if (!comment) {
        throw new Error("Comment is not available");
      }
      if (!comment.likes.includes(userId)) {
        await comment.updateOne({ $push: { likes: userId } });
        const producer = kafka.producer();

        await producer.connect();

        await producer.send({
          topic: "notifications",
          messages: [
            {
              partition: 0,
              key: "notification-update",
              value: JSON.stringify({
                type: "LIKE COMMENT",
                commentId,
                userId,
              }),
            },
          ],
        });

        await producer.disconnect();
        return {
          success: true,
          data: "LIKED",
        };
      } else {
        await comment.updateOne({ $pull: { likes: userId } });
        return {
          success: true,
          data: "DISLIKED",
        };
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

export default new CommentService();
