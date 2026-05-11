const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken")

const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  completeTask
} = require("../controllers/taskController");

router.get("/", authenticateToken, getTasks);
router.get("/:id", authenticateToken, getTaskById);

router.post("/", authenticateToken, createTask);

router.put("/:id", authenticateToken, updateTask);
router.patch("/:id", authenticateToken, completeTask);

router.delete("/:id", authenticateToken, deleteTask);

module.exports = router;
