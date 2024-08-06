import express from "express";
import { getUser, getUsers, login, register } from "../controller/user.js";
import chatRouter from "./chat.js";
import authenticateUser from "../middleware/auth.js";

const router = express.Router();

router.post("/auth/login", login);
router.post("/auth/register", register);
router.get("/auth/users", getUsers);
router.get("/auth/user/:userId", getUser);

export default router;
