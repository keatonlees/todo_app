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
    console.log(">>> ERROR AT mysql.createConnection");
    console.log(err);
    return;
  }
  console.log("Connected to database!");
  console.log(
    "==========================================================================="
  );
});

app.get("/getTagOptions", (req, res) => {
  const query = "SELECT tag_name FROM tag_list";

  db.query(query, (err, result) => {
    if (err) {
      console.log(">>> ERROR AT /getTagOptions");
      console.log(err);
      return;
    }
    res.send(result);
  });
});

app.get("/getAllTasks", (req, res) => {
  const query =
    "SELECT task_list.*, GROUP_CONCAT(tag_name) as task_tags, GROUP_CONCAT(tag_colour) as tag_colours FROM task_list JOIN task_tags ON task_list.id = task_tags.task_id JOIN tag_list ON tag_list.id = task_tags.tag_id GROUP BY task_list.id";

  db.query(query, (err, result) => {
    if (err) {
      console.log(">>> ERROR AT /getAllTasks");
      console.log(err);
      return;
    }
    res.send(result);
  });
});

app.get("/getDailyTasksFromTime/:time", (req, res) => {
  const time = req.params.time;
  // const query =
  //   "SELECT id, task_name, task_due_date, DATE_FORMAT(task_due_time, '%I:%i') as task_due_time FROM task_list WHERE daily_time = ?";
  const query =
    "SELECT task_list.*, dailytime_list.dailytime_time FROM task_dailytime JOIN task_list ON task_list.id = task_dailytime.task_id JOIN dailytime_list ON dailytime_list.id = task_dailytime.dailytime_id WHERE task_dailytime.dailytime_id = ?";

  db.query(query, time, (err, result) => {
    if (err) {
      console.log(">>> ERROR AT /getDailyTasksFromTime/:time");
      console.log(err);
      return;
    }
    res.send(result);
  });
});

app.get("/getLastInsertedId", (req, res) => {
  const query = "SELECT LAST_INSERT_ID() as last_id";

  db.query(query, (err, result) => {
    if (err) {
      console.log(">>> ERROR AT /getLastInsertedId");
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
  const query =
    "INSERT INTO task_list (task_name, task_due_date, task_due_time) VALUES (?,?,?)";
  const values = [task_name, task_due_date, task_due_time];

  db.query(query, values, (err, result) => {
    if (err) {
      console.log(">>> ERROR AT /addTask");
      console.log(err);
      return;
    }
    res.send("Values inserted!");
  });
});

app.post("/addTagToTask", (req, res) => {
  const task_id = req.body.taskid;
  const tag_name = req.body.tagname;
  const query =
    "INSERT INTO task_tags (task_id, tag_id) VALUES (?, (SELECT id FROM tag_list WHERE tag_name = ?))";
  const values = [task_id, tag_name];

  db.query(query, values, (err, result) => {
    if (err) {
      console.log(">>> ERROR AT /addTagToTask");
      console.log(err);
      return;
    }
    res.send("Tag added to task!");
  });
});

app.delete("/deleteTask/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM task_list WHERE id = ?";

  db.query(query, id, (err, result) => {
    if (err) {
      console.log(">>> ERROR AT /deleteTask/:id");
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
      console.log(">>> ERROR AT /updateTaskName");
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
      console.log(">>> ERROR AT /updateTaskDueDate");
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
      console.log(">>> ERROR AT /updateTaskDueTime");
      console.log(err);
      return;
    }
    res.send("Task due time updated!");
  });
});

app.put("/setDaily", (req, res) => {
  const id = req.body.id;
  const time = req.body.time;
  // const query = "UPDATE task_list SET daily_time = ? WHERE id = ?";
  const query =
    "INSERT INTO task_dailytime (task_id, dailytime_id) VALUES (?, (SELECT id FROM dailytime_list WHERE dailytime_time = ?))";
  const values = [id, time];

  db.query(query, values, (err, result) => {
    if (err) {
      console.log(">>> ERROR AT /setDaily");
      console.log(err);
      return;
    }
    res.send("Is daily updated!");
  });
});

app.delete("/clearAllDailyTasks", (req, res) => {
  // const query = "UPDATE task_list SET daily_time = null";
  const query = "DELETE FROM task_dailytime";

  db.query(query, (err, result) => {
    if (err) {
      console.log(">>> ERROR AT /clearAllDailyTasks");
      console.log(err);
      return;
    }
    res.send("All daily tasks cleared!");
  });
});

app.delete("/clearDailyTask/:id/:time", (req, res) => {
  const id = req.params.id;
  const time = req.params.time;
  const query = "DELETE FROM task_dailytime WHERE task_id = ? AND dailytime_id = ?";
  const values = [id, time];

  db.query(query, values, (err, result) => {
    if (err) {
      console.log(">>> ERROR AT /clearDailyTask");
      console.log(err);
      return;
    }
    res.send("Daily task cleared!");
  });
});

app.listen(4000, () => {
  console.log("Node server running!");
});
