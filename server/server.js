const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const host = "0.0.0.0";
const port = 5000;

app.use(express.json());
require("dotenv").config();

const db = new sqlite3.Database("database.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

app.use(cors());
// db.connect(function (err) {
//   if (err) throw err;
//   console.log("connected to database");
// });

app.all("/", (req, res) => {
  res.status(200).json({ message: "Server is running." });
});

app.post("/check-if-exists", async (req, res) => {
  const sql = "SELECT * FROM users WHERE username = ?";
  db.all(sql, [req.body.username], (err, data) => {
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
  db.run(sql, [req.body.username, req.body.password], (err) => {
    if (err) return console.log(err);
    else res.json("user registered successfully");
  });
});

app.post("/save-todos", async (req, res) => {
  const usersql = "SELECT userid FROM users WHERE username = ?";
  db.all(usersql, [req.body.username], (err, data) => {
    if (err) return console.log(err);
    else {
      const sql =
        "INSERT INTO todos(userid, description, completed) VALUES(?,?,?)";
      db.run(
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
  db.all(usersql, [req.body.username], (err, data) => {
    if (err) return console.log(err);
    else {
      const sql = `DELETE FROM todos WHERE userid = ${data[0].userid}`;
      db.run(sql, (err) => {
        if (err) return console.log(err);
        else res.json(`deleted from database`);
      });
    }
  });
});

app.post("/onload", async (req, res) => {
  const sql = "SELECT userid FROM users where username = ?";
  db.all(sql, [req.body.username], (err, data) => {
    if (err) return console.log(err);
    else {
      const tasksql = `SELECT * FROM todos WHERE userid = ${data[0].userid}`;
      const tasks = [];
      const completed = [];
      db.all(tasksql, (err, data) => {
        if (err) console.log(err);
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
