import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/user.js";
import bodyParser from "body-parser";
import mongoDBConnect from "./mongoDB/connection.js";

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

mongoDBConnect();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
