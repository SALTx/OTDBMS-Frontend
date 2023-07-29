/*
Entry point for the application
*/
import dotenv from "dotenv";
import express from "express";
import router from "./routes.js";
import userRouter from "./routes/users.js";
import chalk from "chalk";
import session from "express-session";
import fileUpload from "express-fileupload";

//! workaround for __dirname
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//! Load env vars
dotenv.config();

//! declare and configure app
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static(__dirname));
app.use("/icons", express.static("public/icons"));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

//! session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

//! routes
app.use("/", router);
app.use("/users", userRouter);

//! favicon
app.get("/favicon.ico", (req, res) => {
  res.sendFile(__dirname + "/public/icons/favicon.ico");
});

//! start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(chalk.green(`Server started on port ${PORT}`));
});
