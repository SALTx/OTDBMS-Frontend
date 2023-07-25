import dotenv from "dotenv";
import mysql from "mysql";
import chalk from "chalk";

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

connection.connect(function (err) {
  if (err) throw err;
  console.log(chalk.green("Database is connected successfully !"));
});

async function executeQuery(query, values = []) {
  return new Promise((resolve, reject) => {
    if (values.length > 0) {
      connection.query(query, values, function (err, rows, fields) {
        if (err) reject(err);
        resolve(rows);
      });
    } else {
      connection.query(query, function (err, rows, fields) {
        if (err) reject(err);
        resolve(rows);
      });
    }
  });
}

async function getDatabaseTables() {
  const rows = await executeQuery("SHOW TABLES");
  return rows.map((row) => row[`Tables_in_${process.env.DATABASE_NAME}`]);
}

async function getTableColumns(tableName) {
  const rows = await executeQuery(`SHOW COLUMNS FROM ${tableName}`);
  return rows.map((row) => row.Field);
}

async function getEnumValues(tableName, columnName) {
  const rows = await executeQuery(
    `SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}' AND COLUMN_NAME = '${columnName}'`
  );
  const enumValues = rows[0].COLUMN_TYPE.match(/'([^']+)'/g);
  return enumValues.map((enumValue) => enumValue.replace(/'/g, ""));
}

async function getDistinctCourseCodes() {
  const rows = await executeQuery(
    `SELECT DISTINCT \`Course Code\` FROM students;`
  );
  return rows.map((row) => row.Field);
}

export default {
  connection,
  executeQuery,
  utils: {
    getDatabaseTables,
    getTableColumns,
    getEnumValues,
  },
  student: {
    getDistinctCourseCodes,
  },
};
