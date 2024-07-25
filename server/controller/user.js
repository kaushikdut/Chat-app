import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).send({ message: "Invalid credentials provided!" });
    }

    const comparedPassword = await bcrypt.compare(password, user.password);
    if (!comparedPassword) {
      res.status(400).send({ message: "Wrong password!" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).send({
      message: "Successfully logged in",
      token,
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error!");
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists!" });
    }

    const userName = await User.findOne({ name });
    if (userName) {
      return res
        .status(400)
        .send({ message: "This user name is not available" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).send({
      message: "User registered successfully!",
      token,
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error!");
  }
};

export const searchUser = async (req, res) => {
  const { search } = req.query;

  const user = await User.find({
    name: { $regex: search, $options: "i" },
  }).select("name _id email");

  res.status(200).json(user);
};

export const getUsers = async (req, res) => {
  try {
    const user = await User.find({}, "-password");
    res.status(200).json(user); // Use res.status(200).json(user) to send status and JSON together
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
