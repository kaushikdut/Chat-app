import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/user.js";
import bodyParser from "body-parser";
import mongoDBConnect from "./mongoDB/connection.js";
import authenticateUser from "./middleware/auth.js";
import chatRouter from "./routes/chat.js";
import messageRouter from "./routes/message.js";

const app = express();

dotenv.config();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/", router);
app.use("/chat", authenticateUser, chatRouter);
app.use("/message", authenticateUser, messageRouter);

mongoDBConnect();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
