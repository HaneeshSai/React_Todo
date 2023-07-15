const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();
const host = "0.0.0.0";
const port = 5000;

app.use(express.json());
require("dotenv").config();

const db = mysql.createConnection({
  host: "example-host-name",
  user: "example_username",
  password: "example-password",
  database: "example-database-name",
  port: "example-port-number",
});

app.use(cors());
db.connect(function (err) {
  if (err) throw err;
  console.log("connected to database");
});

app.post("/check-if-exists", async (req, res) => {
  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [req.body.username], (err, data) => {
    if (err) {
      console.log(err);
      return res.json("error at chek");
    }
    if (data.length > 0) {
      if (data[0]["password"] !== req.body.password) {
        res.json("password incorrect");
      } else {
        res.json("password correct");
      }
    } else res.json("username does not exist");
  });
});

app.post("/register-new-user", async (req, res) => {
  const sql = "INSERT INTO users(username, password) VALUES(?,?);";
  db.query(sql, [req.body.username, req.body.password], (err) => {
    if (err) return console.log(err);
    else res.json("user registered successfully");
  });
});

app.post("/save-todos", async (req, res) => {
  const usersql = "SELECT userid FROM users WHERE username = ?";
  db.query(usersql, [req.body.username], (err, data) => {
    if (err) return console.log(err);
    else {
      const sql =
        "INSERT INTO todos(userid, description, completed) VALUES(?,?,?)";
      db.query(
        sql,
        [data[0].userid, req.body.description, `${req.body.completed}`],
        (err) => {
          if (err) return console.log(err);
          else res.json(`${req.body.description} inserted into database`);
        }
      );
    }
  });
});

app.post("/delete", async (req, res) => {
  const usersql = "SELECT userid FROM users WHERE username = ?";
  db.query(usersql, [req.body.username], (err, data) => {
    if (err) return console.log(err);
    else {
      const sql = `DELETE FROM todos WHERE userid = ${data[0].userid}`;
      db.query(sql, (err) => {
        if (err) return console.log(err);
        else res.json(`deleted from database`);
      });
    }
  });
});

app.post("/onload", async (req, res) => {
  const sql = "SELECT userid FROM users where username = ?";
  db.query(sql, [req.body.username], (err, data) => {
    if (err) return console.log(err);
    else {
      const tasksql = `SELECT * FROM todos WHERE userid = ${data[0].userid}`;
      const tasks = [];
      const completed = [];
      db.query(tasksql, (err, data) => {
        data.forEach((element) => {
          completed.push(element.completed);
          tasks.push(element.description);
        });
        res.json({ tasks, completed });
      });
    }
  });
});

app.listen(port, host, () => {
  console.log("listenting to port 5000");
});
