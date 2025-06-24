import * as User from "../models/userModel.js";

export const registerUser = async (req, res) => {
  try {
    const newUser = await User.createUser(req.body);
    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    console.error("Error en registerUser:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Error al registrar usuario" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getUsers();
    res.json({ success: true, users });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error al obtener usuarios" });
  }
};
