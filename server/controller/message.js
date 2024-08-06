import Chat from "../models/chat.js";
import Message from "../models/message.js";
import User from "../models/user.js";

export const sendMessage = async (req, res) => {
  const { message, chatId } = req.body;

  if (!message || !chatId) {
    console.log("Invalid data passed into request");

    return res
      .status(400)
      .json({ error: "Please Provide All Fields To send Message" });
  }

  try {
    let newMessage = {
      sender: req.user.id,
      message: message,
      receiver: chatId,
    };

    let m = await Message.create(newMessage);

    m = await m.populate("sender", "name email");
    m = await m.populate("receiver", "-password");

    res.status(200).json(m);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const allMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const getMessage = await Message.find({
      $and: [
        { $or: [{ sender: chatId }, { receiver: chatId }] },
        { $or: [{ sender: userId }, { receiver: userId }] },
      ],
    })
      .populate("sender", "name email")
      .populate("receiver", "name email");

    res.status(200).json(getMessage);
  } catch (error) {
    res.status(400);
    error.message;
  }
};

export const chatList = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const fetchMessage = await Message.findOne({
      $and: [
        { $or: [{ sender: chatId }, { receiver: chatId }] },
        { $or: [{ sender: userId }, { receiver: userId }] },
      ],
    }).sort({ createdAt: -1 });
    res.status(200).json(fetchMessage);
  } catch (error) {
    console.log(error);
  }
};
