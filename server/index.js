import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/user.js";
import bodyParser from "body-parser";
import mongoDBConnect from "./mongoDB/connection.js";
import authenticateUser from "./middleware/auth.js";
import chatRouter from "./routes/chat.js";
import messageRouter from "./routes/message.js";
import { Server } from "socket.io";
import { createServer } from "http";
import User from "./models/user.js";
import { instrument } from "@socket.io/admin-ui";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

app.use("/", router);
app.use("/chat", authenticateUser, chatRouter);
app.use("/message", authenticateUser, messageRouter);

mongoDBConnect();

const server = createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: [process.env.CLIENT_URL, "https://admin.socket.io"],
  },
});

instrument(io, {
  auth: false,
  mode: "development",
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.emit("connected");

  socket.on("setup", (userDataId) => {
    socket.join(userDataId);
    console.log(userDataId + " connected");
  });

  socket.on("join-chat", (room) => {
    console.log(room + " joined");
    socket.join(room);
  });
  socket.on("leave-chat", (room) => {
    console.log(room + " left");
    socket.leave(room);
  });

  socket.on("addNewUser", (userId) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    }
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("removeUser", (userId) => {
    onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("typing", (room, userId) => {
    socket.in(room).emit("typing", userId);
  });

  socket.on("stop-typing", (room) => {
    socket.in(room).emit("stop-typing");
  });

  socket.on("new-message", (room) => {
    socket.broadcast.to(room).emit("new-message");
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
