require("dotenv").config();

const express = require("express");
const app = express();
const taskRoutes = require("./routes/tasks");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/tasks", taskRoutes);

app.listen(3000, () => {
  console.log("server is running on port 3000")
})
