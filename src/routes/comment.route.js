import express from "express";
import CommentController from "../controllers/comment.controller.js";
const router = express.Router();

router.post("/", CommentController.createPostComment);
router.post("/like", CommentController.likeComment);
router.get("/post/:id", CommentController.getPostComments);

export default router;
