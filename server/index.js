const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "192.168.0.36",
  user: "phpmyadmin",
  password: "singapore",
  database: "todo_app",
  dateStrings: true,
});
db.connect((err) => {
  console.log("Establishing connection to database...");
  if (err) {
    console.log(err);
    return;
  }
  console.log("Connected to database!");
});

app.get("/getTasks", (req, res) => {
  // const query = "SELECT * FROM task_list";
  // const query =
  //   "SELECT task_name, DATE_FORMAT(task_due_date, '%W, %M %e, %Y') as task_due_date, DATE_FORMAT(task_due_time, '%l:%i %p') as task_due_time FROM task_list";
  const query =
    "SELECT id, task_name, task_due_date, DATE_FORMAT(task_due_time, '%I:%i') as task_due_time FROM task_list";

  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    res.send(result);
  });
});

app.post("/addTask", (req, res) => {
  const task_name = req.body.task_name;
  const task_due_date = req.body.task_due_date;
  const task_due_time = req.body.task_due_time;
  const task_tags = req.body.task_tags;
  const query =
    "INSERT INTO task_list (task_name, task_due_date, task_due_time, task_tags) VALUES (?,?,?,?)";
  const values = [task_name, task_due_date, task_due_time, task_tags];

  db.query(query, values, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    res.send("Values inserted!");
  });
});

app.delete("/deleteTask/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM task_list WHERE id = ?";

  db.query(query, id, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    res.send("Deleted!");
  });
});

app.put("/updateTaskName", (req, res) => {
  const id = req.body.id;
  const task_name = req.body.task_name;
  const query = "UPDATE task_list SET task_name = ? WHERE id = ?";
  const values = [task_name, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    res.send("Task name updated!");
  });
});

app.put("/updateTaskDueDate", (req, res) => {
  const id = req.body.id;
  const task_due_date = req.body.task_due_date;
  const query = "UPDATE task_list SET task_due_date = ? WHERE id = ?";
  const values = [task_due_date, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    res.send("Task due date updated!");
  });
});

app.put("/updateTaskDueTime", (req, res) => {
  const id = req.body.id;
  const task_due_time = req.body.task_due_time;
  const query = "UPDATE task_list SET task_due_time = ? WHERE id = ?";
  const values = [task_due_time, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    res.send("Task due time updated!");
  });
});

app.listen(4000, () => {
  console.log("Node server running!");
});
