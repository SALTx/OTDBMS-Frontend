import express from "express";
import database from "./database.js";
import fs from "fs";
import moment from "moment";
import bcrypt from "bcrypt";

const router = express.Router();

//! Middleware to add session to res.locals
router.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

//! Render index page
router.get("/", (req, res) => {
  res.render("index", {
    page: "index",
    title: "Home",
  });
});

//! START Universal pages
{
  //! Students
  router.get("/students", async (req, res) => {
    const table = "studentsview";
    const studentsview = await database.executeQuery(`SELECT * FROM ${table}`);
    const partialExists = fs.existsSync(`views/partials/controls/${table}.ejs`);

    res.render("universal", {
      page: "Students",
      table,
      title: "Students",
      data: studentsview,
      partialExists: partialExists,
    });
  });

  //! Overseas Programs
  router.get("/overseasprograms", async (req, res) => {
    const table = "overseasprogramsview";
    const overseasprogramsview = await database.executeQuery(
      `SELECT * FROM ${table}`,
    );
    const partialExists = fs.existsSync(`views/partials/controls/${table}.ejs`);

    res.render("universal", {
      page: "Overseas Programs",
      table,
      title: "Overseas Programs",
      data: overseasprogramsview,
      partialExists,
    });
  });

  //! Trips
  router.get("/trips", async (req, res) => {
    const tripdetails = await database.executeQuery(
      "SELECT * FROM tripdetails",
    );
    const partialExists = fs.existsSync(
      `views/partials/controls/tripdetails.ejs`,
    );

    res.render("universal", {
      page: "Trip Details",
      table: "tripdetails",
      title: "Trip Details",
      data: tripdetails,
      partialExists,
    });
  });
}

//! Oimp Details
router.get("/oimpdetails", async (req, res) => {
  const oimpdetails = await database.executeQuery("SELECT * FROM oimpdetails");
  const partialExists = fs.existsSync(
    `views/partials/controls/oimpdetails.ejs`,
  );

  res.render("universal", {
    page: "Oimp Details",
    table: "oimpdetails",
    title: "Oimp Details",
    data: oimpdetails,
    partialExists,
  });
});
//! END Universal pages

//!! Admin: Audit table
router.get("/audittable", async (req, res) => {
  // if user is not logged in or is not an admin, redirect to home page
  if (!req.session.user || req.session.user.accountType != "Admin") {
    res.redirect("/");
    return;
  }

  const audittable = await database.executeQuery("SELECT * FROM audittable");
  const partialExists = fs.existsSync(`views/partials/controls/audittable.ejs`);

  res.render("universal", {
    page: "Audit Table",
    table: "audittable",
    title: "Audit Table",
    data: audittable,
    partialExists,
  });
});

//! Resources
router.get("/resources", async (req, res) => {
  res.render("resources", {
    page: "Resources",
    title: "Resources",
  });
});

router.get("/manage", async (req, res) => {
  // if user is not logged in is not an admin, redirect to home page
  if (!req.session.user || req.session.user.accountType != "Admin") {
    res.redirect("/");
    return;
  }

  const users = await database.executeQuery("SELECT * FROM users");

  res.render("manage", {
    page: "Manage",
    title: "Manage",
    users,
  });
});

//! START Auth routes
{
  //! Login page
  router.get("/login", (req, res) => {
    const { error } = req.query;

    res.render("login", {
      page: "Login",
      title: "Login",
      error: error ? "Invalid username or password" : "",
    });
  });

  //! Login action
  router.post("/login", (req, res) => {
    let { username, password } = req.body;
    const query =
      "SELECT * FROM users WHERE username = ? AND BINARY password = ?";
    const values = [username, password];
    database.executeQuery(query, values).then((result) => {
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

  //! Logout action
  router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
  });
}
//! END Auth routes

router.get("/database/views/kpi/:num", async (req, res) => {
  const num = req.params.num;
  if (num < 1 || num > 4) {
    res.send("Invalid KPI number");
    return;
  }
  const kpi = await database.executeQuery(`SELECT * FROM kpi${num}`);
  res.send(kpi);
});

router.get("/api/countries", async (req, res) => {
  const countries = await database.executeQuery("SELECT * FROM countries");
  res.send(countries);
});

// TODO: remove space from user's name or just use username
// uploading file
router.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.send("No files were uploaded.");
    return;
  } else {
    const file = req.files.file;
    const filetype = file.name.split(".")[1];
    const filesize = file.size;
    const allowedTypes = ["jpg", "jpeg", "png", "gif"];
    const allowedSize = 1024 * 1024; // 1 MB

    if (!allowedTypes.includes(filetype)) {
      res.send("Invalid file type.");
      return;
    }

    if (filesize > allowedSize) {
      res.send("File size too large.");
      return;
    }

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
