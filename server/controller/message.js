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
      chat: chatId,
    };

    let m = await Message.create(newMessage);

    m = await m.populate("sender", "name email");
    m = await m.populate("chat", "name users");

    await Chat.findByIdAndUpdate(chatId, { latestMessage: m }, { new: true });

    res.status(200).json(m);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const allMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const getMessage = await Message.find({ chat: chatId })
      .populate("sender", "name email")
      .populate("chat", "name users");

    res.status(200).json(getMessage);
  } catch (error) {
    res.status(400);
    error.message;
  }
};
