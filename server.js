import dotenv from "dotenv";
import express from "express";
import router from "./routes.js";
import userRouter from "./routes/users.js";
import chalk from "chalk";
import session from "express-session";
import fileUpload from "express-fileupload";

// workaround for __dirname
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static(__dirname));
app.use("/icons", express.static("public/icons"));
app.use(express.urlencoded({ extended: true }));

// uploading files
app.use(fileUpload());

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// routes
app.use("/", router);
app.use("/users", userRouter);

// favicon
app.get("/favicon.ico", (req, res) => {
  res.sendFile(__dirname + "/public/icons/favicon.ico");
});

// start server
app.listen(process.env.PORT || 3000, () => {
  console.log(
    chalk.green(`Server started on port ${process.env.PORT || 3000}`)
  );
});
