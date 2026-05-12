require("dotenv").config();

const express = require("express");
const app = express();
const taskRoutes = require("./routes/tasks");
const authRoutes = require("./routes/auth");
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.json());
app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server API is running");
});

app.listen(3000, () => {
  console.log("server is running on port 3000")
})
