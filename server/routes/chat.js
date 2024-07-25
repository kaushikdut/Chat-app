import express from "express";
import { getChats, getChat } from "../controller/chat.js";
const chatRouter = express.Router();

chatRouter.route("/").post(getChat).get(getChats);

export default chatRouter;
