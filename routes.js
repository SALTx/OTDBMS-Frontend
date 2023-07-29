import express from "express";
import database from "./database.js";
import fs from "fs";
import moment from "moment";
import importFiles from "./importFiles.js";

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
    const table = "studentsView";
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
    const table = "overseasProgramsView";
    const overseasprogramsview = await database.executeQuery(
      `SELECT * FROM ${table}`
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
      "SELECT * FROM tripDetails"
    );
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
}

//! Oimp Details
router.get("/oimpdetails", async (req, res) => {
  const table = "oimpDetailsView";
  const oimpdetails = await database.executeQuery(`SELECT * FROM ${table}`);
  const partialExists = fs.existsSync(`views/partials/controls/${table}.ejs`);

  res.render("universal", {
    page: "Oimp Details",
    table,
    title: "Oimp Details",
    data: oimpdetails,
    partialExists: partialExists,
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

  const audittable = await database.executeQuery("SELECT * FROM auditTable");
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
    const query = `SELECT * from users where username = '${username}' and password = '${password}'`;
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
  const kpi = await database.executeQuery(`SELECT * FROM KPI${num}`);
  res.send(kpi);
});

router.get("/api/countries", async (req, res) => {
  const countries = await database.executeQuery("SELECT * FROM countries");
  res.send(countries);
});

// TODO: remove space from user's name or just use username
// uploading file
router.post("/upload", (req, res) => {
  const table = req.body.table;
  if (!req.files || Object.keys(req.files).length === 0) {
    res.send("No files were uploaded.");
    return;
  } else {
    const file = req.files.file;
    const filetype = file.name.split(".")[1];
    const filesize = file.size;
    const allowedTypes = ["xml", "xls", "xlsx", "json", "csv"];
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
    let filename = `${req.body.name}_${timestamp}.${filetype}`;
    filename = `${req.body.name.replace(/\s/g, "")}_${timestamp}.${filetype}`;

    let filepath = `./public/uploads/${filename}`;
    let requiredHeaders;

    database.utils.getTableColumns(table).then((columns) => {
      requiredHeaders = columns;
      console.log(requiredHeaders);
      file.mv(filepath, () => {});

      if (filetype == "xml") {
        database.utils.jsonToSQL(
          importFiles.xml(filepath, requiredHeaders),
          table
        );
      } else if (filetype === "xls" || filetype === "xlsx") {
        database.utils.jsonToSQL(
          importFiles.xlsx(filepath, requiredHeaders),
          table
        );
      } else if (filetype == "csv") {
        database.utils.jsonToSQL(
          importFiles.csv(filepath, requiredHeaders),
          table
        );
      } else if (filetype == "json") {
        database.utils.jsonToSQL(
          importFiles.json(filepath, requiredHeaders),
          table
        );
      } else {
        res.send("Invalid file type.");
        return;
      }
      alert("File uploaded successfully");
    });
  }
});

export default router;
