import express from "express";
import { getUsers, login, register } from "../controller/user.js";
import chatRouter from "./chat.js";
import authenticateUser from "../middleware/auth.js";

const router = express.Router();

router.post("/auth/login", login);
router.post("/auth/register", register);
router.get("/auth/users", getUsers);

export default router;
