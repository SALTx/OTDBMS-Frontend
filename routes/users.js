import express from "express";
import database from "../database.js";
import chalk from "chalk";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  database.executeQuery("SELECT * FROM users", (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
});

userRouter.post("/", (req, res) => {
  const { username, password, accountType, name } = req.body;
  const query = `INSERT INTO users (username, password, accountType, name) VALUES ('${username}', '${password}', '${accountType}', '${name}')`;
  database
    .executeQuery(query)
    .then((result) => {
      res.status(200).send("Values Inserted");
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal Server Error");
    });
});

userRouter.get("/:username", (req, res) => {
  const { username } = req.params;
  database
    .executeQuery(`SELECT * FROM users WHERE username = ${username}`)
    .then((result) => {
      if (result.length === 0) {
        res.status(404).send("User not found");
      } else {
        res.status(200).json(result[0]);
      }
    });
});

userRouter.delete("/:username", (req, res) => {
  const { username } = req.params;
  database
    .executeQuery(`DELETE FROM users WHERE username = '${username}'`)
    .then((result) => {
      if (result.affectedRows === 0) {
        res.status(404).send("User not found");
      } else {
        res.status(200).send("Values Deleted");
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal Server Error");
    });
});

userRouter.put("/:username", (req, res) => {
  const { username } = req.params;
  const { password, accountType, name } = req.body;
  database
    .executeQuery(
      `UPDATE users SET password = '${password}', accountType = '${accountType}', name = '${name}' WHERE username = '${username}'`
    )
    .then((result) => {
      if (result.affectedRows === 0) {
        res.status(404).send("User not found");
      } else {
        res.status(200).send("Values Updated");
      }
    });
});

export default userRouter;
