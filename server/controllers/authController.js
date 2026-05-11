const supabase = require("../db/supabaseClient");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const {
  isValidEmail
} = require("../utils/validators.js")

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({message: "All fields are required"});
  }

  if (!isValidEmail(email.trim())) {
    return res.status(400).json({ message: "Invalid email format" });
  }

   if (password.length < 8) return res.status(400).json({
    message:
      "Password must be at least 8 characters"
  });

  const { data, error } = await supabase
  .from("users")
  .select()
  .eq("email", email.trim())

  const user = data[0];

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(200).json({ token });
}

const register = async (req, res) => {

  console.log("REGISTER ROUTE HIT");

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({message: "All fields are required"});
  }

  if (!isValidEmail(email.trim())) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 8) return res.status(400).json({
    message:
      "Password must be at least 8 characters"
  });

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const {data, error} = await supabase
  .from("users")
  .insert([{ email, password_hash: hashedPassword }])
  .select()
  .single();

   if (error) {
    return res.status(500).json({
      message: error.message
    });
  }

  return res.status(201).json({
    message: "User registered successfully",
    user: data
  });
}

module.exports = {
  login,
  register
}
