import database from "./database.js";
import fs from "fs";
import xlsx from "xlsx";
import xml2js from "xml2js";
import dotenv from 'dotenv';

dotenv.config();

async function getTableRows(tableName) {
  const query = `SELECT * FROM ${tableName}`;
  const result = await database.executeQuery(query);
  if (!result || !result.rows || result.rows.length === 0) {
    throw new Error(`No rows found in table '${tableName}'.`);
  }
  return result.rows;
}

async function exportToCSV(tableName, destination) {
  const rows = await getTableRows(tableName);
  const headers = Object.keys(rows[0]);

  const csvData = [headers.join(",")];
  rows.forEach((row) => {
    const values = headers.map((header) => row[header]);
    csvData.push(values.join(","));
  });

  const csvString = csvData.join("\n");
  fs.writeFileSync(destination, csvString);
}

async function exportToJSON(tableName, destination) {
  const rows = await getTableRows(tableName);
  const jsonData = JSON.stringify(rows, null, 2);
  fs.writeFileSync(destination, jsonData);
}

async function exportToXML(tableName, destination) {
  const rows = await getTableRows(tableName);
  const xmlBuilder = new xml2js.Builder({ rootName: "students" });
  const xmlString = xmlBuilder.buildObject({ student: rows });
  fs.writeFileSync(destination, xmlString);
}

async function exportToXLSX(tableName, destination) {
  const rows = await getTableRows(tableName);
  const headers = Object.keys(rows[0]);
  const data = [headers];
  rows.forEach((row) => {
    const values = headers.map((header) => row[header]);
    data.push(values);
  });

  const worksheet = xlsx.utils.aoa_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "students");
  xlsx.writeFile(workbook, destination);
}

async function exportTable(tableName, destination, format) {
  switch (format) {
    case "csv":
      await exportToCSV(tableName, destination);
      break;
    case "json":
      await exportToJSON(tableName, destination);
      break;
    case "xml":
      await exportToXML(tableName, destination);
      break;
    case "xlsx":
      await exportToXLSX(tableName, destination);
      break;
    default:
      throw new Error(`Unsupported file format: ${format}`);
  }
}

export default {
  xml: exportToXML,
  xlsx: exportToXLSX,
  json: exportToJSON,
  csv: exportToCSV,
};
