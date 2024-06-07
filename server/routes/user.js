import express from "express";
import { login, register } from "../controller/user.js";

const router = express.Router();

router.post("/auth/login", login);
router.post("/auth/register", register);

export default router;
