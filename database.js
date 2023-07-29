import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2/promise";
import chalk from "chalk";

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: "root",
  password: "",
  database: "opsystem_test",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.log(err);
    throw new Error("Cant connect to database");
  }
  console.log(chalk.green("Database is connected successfully !"));
  connection.release();
});

async function executeQuery(query) {
  const connection = await pool.getConnection();
  try {
    const [rows, fields] = await connection.query(query);
    return rows;
  } finally {
    connection.release();
  }
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
    `SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}' AND COLUMN_NAME = '${columnName}'`,
  );
  const enumValues = rows[0].COLUMN_TYPE.match(/'([^']+)'/g);
  return enumValues.map((enumValue) => enumValue.replace(/'/g, ""));
}

async function getDistinctCourseCodes() {
  const rows = await executeQuery(
    `SELECT DISTINCT \`Course Code\` FROM students;`,
  );
  return rows.map((row) => row.Field);
}

export default {
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
