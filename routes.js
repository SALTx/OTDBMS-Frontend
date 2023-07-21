import express from "express";
import database from "./database.js";
import fs from "fs";
import chalk from "chalk";
import moment from "moment";

const router = express.Router();

// Middleware to add session to res.locals
router.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

router.get("/", (req, res) => {
  res.render("index", {
    page: "index",
    title: "Home",
  });
});

router.get("/studentsview", async (req, res) => {
  const studentsview = await database.executeQuery("SELECT * FROM studentsview");
  const partialExists = fs.existsSync(`views/partials/controls/students.ejs`);

  res.render("universal", {
    page: "Students",
    table: "studentsview",
    title: "Students",
    data: studentsview,
    partialExists: partialExists,
  });
});

router.get("/overseasprogramsview", async (req, res) => {
  const overseasprogramsview = await database.executeQuery(
    "SELECT * FROM overseasprogramsview"
  );
  const partialExists = fs.existsSync(
    `views/partials/controls/overseasprograms.ejs`
  );

  res.render("universal", {
    page: "Overseas Programs",
    table: "overseasprogramsview",
    title: "Overseas Programs",
    data: overseasprogramsview,
    partialExists,
  });
});

router.get("/trips", async (req, res) => {
  const trips = await database.executeQuery("SELECT * FROM trips");
  const partialExists = fs.existsSync(`views/partials/controls/trips.ejs`);

  res.render("universal", {
    page: "Trips",
    table: "trips",
    title: "Trips",
    data: trips,
    partialExists,
  });
});

router.get("/tripdetails", async (req, res) => {
  const tripdetails = await database.executeQuery("SELECT * FROM tripdetails");
  const partialExists = fs.existsSync(
    `views/partials/controls/tripdetails.ejs`
  );

  res.render("universal", {
    page: "Trip Details",
    table: "tripdetails",
    title: "Trip Details",
    data: tripdetails,
    partialExists,
  });
});

router.get("/oimpdetails", async (req, res) => {
  const oimpdetails = await database.executeQuery("SELECT * FROM oimpdetails");
  const partialExists = fs.existsSync(
    `views/partials/controls/oimpdetails.ejs`
  );

  res.render("universal", {
    page: "Oimp Details",
    table: "oimpdetails",
    title: "Oimp Details",
    data: oimpdetails,
    partialExists,
  });
});

router.get("/audittable", async (req, res) => {
  const audittable = await database.executeQuery("SELECT * FROM audittable");
  const partialExists = fs.existsSync(
    `views/partials/controls/audittable.ejs`
  );

  res.render("universal", {
    page: "Audit Table",
    table: "audittable",
    title: "Audit Table",
    data: audittable,
    partialExists,
  });
});


router.get("/resources", async (req, res) => {
  res.render("resources", {
    page: "Resources",
    title: "Resources",
  });
});
// Auth routes
router.get("/login", (req, res) => {
  const { error } = req.query;

  res.render("login", {
    page: "Login",
    title: "Login",
    error: error ? "Invalid username or password" : "",
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = '${username}' AND BINARY password = '${password}'`;
  database.executeQuery(query).then((result) => {
    if (result.length == 1) {
      delete result[0].password;
      req.session.user = result[0];
      req.session.save();

      res.redirect("/");
    } else {
      res.redirect("/login?error=1");
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// Database routes
router.get("/database/views/kpi/:num", async (req, res) => {
  const num = req.params.num;
  if (num < 1 || num > 4) {
    res.send("Invalid KPI number");
    return;
  }
  const kpi = await database.executeQuery(`SELECT * FROM kpi${num}`);
  res.send(kpi);
});

// TODO: remove space from user's name or just use username
// uploading file
router.post("/upload", (req, res) => {
  console.log(req.files);
  if (!req.files || Object.keys(req.files).length === 0) {
    res.send("No files were uploaded.");
    return;
  } else {
    // rename the file to user's name and timestamp
    const file = req.files.file;
    const filetype = file.name.split(".")[1];
    const timestamp = moment().format("YYYYMMDD_HHmm");
    const filename = `${req.body.name}_${timestamp}.${filetype}`;

    file.mv(`public/uploads/${filename}`, (err) => {
      if (err) {
        res.send("Error uploading file");
      } else {
        res.send("File uploaded");
      }
    });

    // once its uploaded, add it to the database
  }
});

export default router;
