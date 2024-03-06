import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    parentId: {
      type: String,
      default: "",
    },
    likes: {
      type: [
        {
          type: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
