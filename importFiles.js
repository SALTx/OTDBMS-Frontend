// TODO fix csv newline bug when importing

import fs from "fs";
import xlsx from "xlsx";
import xml2js from "xml2js";

function importXMLFile(filePath, requiredHeaders) {
  const data = fs.readFileSync(filePath, "utf8");
  let output = null;

  const parser = new xml2js.Parser({ explicitArray: false });
  parser.parseString(data, (error, result) => {
    if (error) {
      throw new Error(`Failed to parse XML file: ${error}`);
    }
    if (requiredHeaders) {
      const records = result["student-data"]["record"];
      const filteredResult = records.map((record) => {
        const filteredRecord = {};

        for (const key of requiredHeaders) {
          if (key in record) {
            filteredRecord[key] = record[key];
          } else {
            throw new Error(`Required header '${key}' not found in XML.`);
          }
        }
        return filteredRecord;
      });

      output = filteredResult;
    } else {
      output = result;
    }
  });

  return output;
}

function importXLSXFile(filePath, requiredHeaders) {
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(worksheet);

  const headers = Object.keys(data[0]);

  for (let i = 0; i < requiredHeaders.length; i++) {
    const header = requiredHeaders[i];
    if (!headers.includes(header)) {
      throw new Error(`Required header '${header}' not found.`);
    }
  }

  const output = data.map((row) => {
    const obj = {};
    headers.forEach((header) => {
      if (requiredHeaders.includes(header)) {
        obj[header] = row[header];
      }
    });
    return obj;
  });

  return output;
}

function importJSONFile(filepath, requiredHeaders) {
  const data = fs.readFileSync(filepath, "utf8");
  const jsonData = JSON.parse(data);

  const output = jsonData.map((item) => {
    const filteredItem = {};
    for (const header of requiredHeaders) {
      if (!(header in item)) {
        throw new Error(`Required header '${header}' not found in JSON.`);
      }
      filteredItem[header] = item[header];
    }
    return filteredItem;
  });
  return output;
}

function importCSVFile(filepath, requiredHeaders) {
  const data = fs.readFileSync(filepath, "utf8");
  const output = [];

  const lines = data.split("\n");
  const headers = lines[0].split(",").map((header) => header.trim()); // Trim headers

  for (let header of requiredHeaders) {
    if (!headers.includes(header)) {
      throw new Error(`Required header '${header}' not found in CSV.`);
    }
  }

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    const values = line.replace(/\r/g, "").split(",");
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      const value = values[j];
      obj[header] = value;
    }
    output.push(obj);
  }

  return output;
}

export default {
  xml: importXMLFile,
  xlsx: importXLSXFile,
  json: importJSONFile,
  csv: importCSVFile,
};
