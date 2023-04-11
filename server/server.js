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
    const response = await db.query("SELECT * FROM login_details");
    res.json({
      status: "success",
      logins: response.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

//get a single login
app.get("/:id", async (req, res) => {
  try {
    const response = await db.query(
      "SELECT login_details.id, login_details.username, login_details.email, tasks.id AS project_id, tasks.task AS project_name,tasks.date AS project_date,tasks.description AS project_description,tasks.status AS project_status FROM login_details LEFT JOIN tasks ON tasks.user_id = login_details.id WHERE login_details.id = $1;",
      [req.params.id]
    );
    res.json({
      status: "success",
      results: response.rows,
    });
  } catch (error) {
    console.log(error);
  }
});
app.get("/:id/task", async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM tasks WHERE id = $1;", [
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

//create login details
app.post("/", async (req, res) => {
  const { password } = req.body;
  //hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const response = await db.query(
      "INSERT INTO login_details (username,password,email) values ($1,$2,$3) returning *",
      [req.body.username, hashedPassword, req.body.email]
    );
    res.json({
      status: "success",
      logins: response.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: "username or mail already in use",
    });
  }
});

//update login
app.put("/:id", async (req, res) => {
  try {
    const response = await db.query(
      "UPDATE login_details SET username=$1,password=$2,email=$3 WHERE id=$4 returning *",
      [req.body.username, req.body.password, req.body.email, req.params.id]
    );
    res.json({
      status: "success",
      logins: response.rows[0],
    });
  } catch (error) {
    console.log(error);
  }
});

//delete login
app.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM tasks WHERE id = $1", [req.params.id]);
    res.json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});

//create login jwt token for client after authentication
app.post("/signIn", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.query(
      "SELECT * FROM login_details WHERE email = $1",
      [email]
    );

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
app.post("/task", async (req, res) => {
  try {
    console.log(req.body);
    const { user_id, task, date, description, status } = req.body;
    const tasks = await db.query(
      "INSERT INTO tasks (user_id,task,date,description,status) values ($1,$2,$3,$4,$5) returning *",
      [user_id, task, date, description, status]
    );
    res.json({
      status: "success",
      results: tasks.rows[0],
    });
  } catch (error) {
    console.log(error);
  }
});

//update task
app.put("/:id/update", async (req, res) => {
  try {
    const response = await db.query(
      "UPDATE tasks SET task=$1,status=$2,date=$3,description=$4, user_id = $5 WHERE id=$6 returning *",
      [
        req.body.task,
        req.body.status,
        req.body.date,
        req.body.description,
        req.body.user_id,
        req.params.id,
      ]
    );
    res.json({
      status: "success",
      logins: response.rows[0],
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT || 4010, () => {
  console.log(`server listening at port ${process.env.PORT}...`);
});
