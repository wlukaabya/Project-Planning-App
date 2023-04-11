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

//get a single login
app.get("/:id", async (req, res) => {
  try {
    const response = await db.query(
      "SELECT users.id, users.username, users.email, projects.id AS project_id, projects.project_title AS project_name,projects.date AS project_date FROM users LEFT JOIN projects ON projects.user_id = users.id WHERE users.id = $1;",
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
      "INSERT INTO users (username,password,email) values ($1,$2,$3) returning *",
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
    console.log(req.body);
    const { user_id, project_title, date } = req.body;
    const project = await db.query(
      "INSERT INTO projects (user_id,project_title,date) values ($1,$2,$3) returning *",
      [user_id, project_title, date]
    );
    res.json({
      status: "success",
      results: project.rows[0],
    });
  } catch (error) {
    console.log(error);
  }
});

//update task
app.put("/:id/update", async (req, res) => {
  try {
    const response = await db.query(
      "UPDATE projects SET project_title=$1,date=$2, user_id = $3 WHERE id=$4 returning *",
      [req.body.task, req.body.date, req.body.user_id, req.params.id]
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
