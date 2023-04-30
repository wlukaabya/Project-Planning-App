const express = require("express");
require("dotenv").config();
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const db = new Pool();
const apikey = process.env.API_KEY;

//middleware
app.use(express.json());
app.use(cors());

//routes protection
app.use((req, res, next) => {
  const key = req.get("apikey");
  if (key && key === apikey) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
});

//get all logins
app.get("/", async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM users");
    res.json({
      status: "success",
      logins: response.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

//get single user
app.get("/user/:id", async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM users WHERE id=$1", [
      req.params.id,
    ]);
    res.json({
      status: "success",
      results: response.rows[0],
    });
  } catch (error) {
    console.log("awaiting user");
  }
});

//get users whose role is user
app.get("/users", async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM users WHERE role='user'");
    res.json({
      status: "success",
      results: response.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

//get a single login
// app.get("/:id", async (req, res) => {
//   try {
//     const response = await db.query(
//       "SELECT users.id, users.username, users.email,users.role, projects.id AS project_id, projects.project_title AS project_name,projects.date AS project_date FROM users LEFT JOIN projects ON projects.user_id = users.id WHERE users.id = $1;",
//       [req.params.id]
//     );
//     res.json({
//       status: "success",
//       results: response.rows,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

//get single project
app.get("/:id/project", async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM projects WHERE id = $1;", [
      req.params.id,
    ]);
    res.json({
      status: "success",
      results: response.rows[0],
    });
  } catch (error) {
    console.log(error);
  }
});

//get projects
app.get("/project", async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM projects");
    res.json({
      status: "success",
      results: response.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

//get assigned projects
app.get("/projects/:assignee", async (req, res) => {
  try {
    const response = await db.query(
      "SELECT DISTINCT projects.* FROM projects JOIN tasks ON tasks.project_id = projects.id WHERE tasks.assignee = $1;",
      [req.params.assignee]
    );
    res.json({
      status: "success",
      results: response.rows,
    });
  } catch (error) {
    console.log("awaiting assignee data");
  }
});

//delete project
app.delete("/:id", async (req, res) => {
  try {
    const response = await db.query("DELETE FROM projects WHERE id = $1 ", [
      req.params.id,
    ]);
    res.json({
      status: "success",
    });
  } catch (error) {
    res.json({
      message: "First clear your tasks before deleting the project!",
    });
  }
});

//create user login details
app.post("/", async (req, res) => {
  const { password } = req.body;
  //hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const response = await db.query(
      "INSERT INTO users (username,password,email,role) values ($1,$2,$3,$4) returning *",
      [req.body.username, hashedPassword, req.body.email, req.body.role]
    );
    res.json({
      status: "success",
      logins: response.rows[0],
    });
  } catch (error) {
    res.json({
      error: "username or mail already in use",
    });
  }
});

//Create Admin Login details
app.post("/admin", async (req, res) => {
  const { password } = req.body;
  //hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    if (req.body.sysPassword === process.env.SYS_PWD) {
      const response = await db.query(
        "INSERT INTO users (username,password,email,role) values ($1,$2,$3,$4) returning *",
        [req.body.username, hashedPassword, req.body.email, req.body.role]
      );
      res.json({
        status: "success",
        logins: response.rows[0],
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      error: "username or mail already in use",
    });
  }
});

//create login jwt token for client after authentication
app.post("/signIn", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    //return message if user doesnt exist
    if (user.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    //generate jwt token for client
    const token = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    //return token to client
    res.json({
      id: user.rows[0].id,
      token,
    });
  } catch (error) {
    console.log(error);
  }
});

//register project
app.post("/project", async (req, res) => {
  try {
    const { project_title, date } = req.body;
    const project = await db.query(
      "INSERT INTO projects (project_title,date) values ($1,$2) returning *",
      [project_title, date]
    );
    res.json({
      status: "success",
      results: project.rows[0],
    });
  } catch (error) {
    console.log(error);
  }
});

//update project
app.put("/:id/project", async (req, res) => {
  try {
    const response = await db.query(
      "UPDATE projects SET project_title=$1,date=$2 WHERE id=$3 returning *",
      [req.body.project_title, req.body.date, req.params.id]
    );
    res.json({
      status: "success",
      logins: response.rows[0],
    });
  } catch (error) {
    console.log(error);
  }
});

//add tasks
app.post("/task", async (req, res) => {
  try {
    const response = await db.query(
      "INSERT INTO tasks (project_id,task,description,status,date,assignee) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [
        req.body.project_id,
        req.body.task,
        req.body.description,
        req.body.status,
        req.body.date,
        req.body.assignee,
      ]
    );
    res.json({
      status: "success",
      results: response.rows[0],
    });
  } catch (error) {
    console.log(error);
  }
});

//get tasks
app.get("/:id/tasks", async (req, res) => {
  try {
    const response = await db.query(
      "SELECT * FROM tasks WHERE project_id = $1;",
      [req.params.id]
    );
    res.json({
      status: "success",
      tasks: response.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

//get task
app.get("/:id/task", async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM tasks WHERE id=$1", [
      req.params.id,
    ]);
    res.json({
      status: "success",
      results: response.rows[0],
    });
  } catch (error) {
    console.log(error);
  }
});

//edit task
app.put("/:id/tasks", async (req, res) => {
  try {
    const { project_id, task, status, description, date, assignee } = req.body;
    const response = await db.query(
      "UPDATE tasks SET project_id=$1,task=$2, status=$3,description = $4, date=$5,assignee=$6 WHERE id=$7 returning *",
      [project_id, task, status, description, date, assignee, req.params.id]
    );
    res.json({
      status: "success",
      results: response.rows[0],
    });
  } catch (error) {
    console.log(error);
  }
});

//delete a task
app.delete("/:id/tasks", async (req, res) => {
  try {
    const response = await db.query("DELETE FROM tasks WHERE id=$1", [
      req.params.id,
    ]);
    res.json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT || 4010, () => {
  console.log(`server listening at port ${process.env.PORT}...`);
});
