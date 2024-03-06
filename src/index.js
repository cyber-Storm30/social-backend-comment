import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./config/connection.js";
import CommentRouter from "./routes/comment.route.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
dotenv.config();
const PORT = process.env.PORT || 8003;

app.use("/", CommentRouter);

app.listen(PORT, async () => {
  console.log("Comment Server connected on port", PORT);
  await connectDb();
});
