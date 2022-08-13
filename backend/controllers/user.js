const User = require("../models/user");

exports.create = async (req, res) => {
  const { name, email, password } = req.body;

  const oldUser = await User.findOne({ email });

  if (oldUser) {
    return res.status(401).json({ error: "The email you entered already exists" });
  }

  const newUser = await User({ name, email, password });

  await newUser.save();

  res.json({ user: newUser });
};
