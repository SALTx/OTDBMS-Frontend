//* Event listener for the checkbox in the table header to show/hide columns
document.addEventListener("DOMContentLoaded", () => {
  const checkboxes = document.querySelectorAll(".column-checkbox");
  const table = document.getElementById("data-table");

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const isChecked = event.target.checked;
      const columnIndex = event.target.dataset.index;
      const columnCells = table.querySelectorAll(
        `tr td:nth-child(${parseInt(columnIndex) + 1})`
      );

      columnCells.forEach((cell) => {
        cell.style.display = isChecked ? "" : "none";
      });

      const headerCells = table.querySelectorAll(
        `thead th:nth-child(${parseInt(columnIndex) + 1})`
      );
      headerCells.forEach((headerCell) => {
        headerCell.style.display = isChecked ? "" : "none";
      });
    });
  });
});

$(document).ready(() => {
  $("#sort-select").on("change", () => {
    const column = $("#sort-select").val();
    const sortOrder = $("#sort-order").is(":checked") ? 1 : -1;
    console.log(data);
    const sortedData = data.sort((a, b) => {
      if (a[column] < b[column]) {
        return -1 * sortOrder;
      } else if (a[column] > b[column]) {
        return 1 * sortOrder;
      } else {
        return 0;
      }
    });
    renderTable(sortedData);

    // change the value of span with id "row-count" to number of visible rows in the table
    const rowCount = $("#data-table tbody tr:visible").length;
    $("#row-count").text(rowCount);
  });

  $("#search-button").on("click", () => {
    const column = $("#sort-select").val();
    const searchText = $("#search-input").val().toLowerCase();

    // Validate that a column has been selected
    if (!column) {
      alert("Please select a column to search.");
      return;
    }

    // Validate that search text has been entered
    if (!searchText) {
      alert("Please enter search text.");
      return;
    }

    const filteredData = data.filter((row) => {
      return row[column].toLowerCase().includes(searchText);
    });

    // Display an error message if no results were found
    if (filteredData.length === 0) {
      alert("No results found.");
      return;
    }

    renderTable(filteredData);

    // change the value of span with id "row-count" to number of visible rows in the table
    const rowCount = $("#data-table tbody tr:visible").length;
    $("#row-count").text(rowCount);
  });

  // Update the row count when the sort order checkbox is changed
  $("#sort-order").on("change", () => {
    const rowCount = $("#data-table tbody tr:visible").length;
    $("#row-count").text(rowCount);
  }); // // Clear the search input when the sort column is changed
  // $("#sort-select").on("change", () => {
  //   $("#search-input").val("");
  // });
});

function renderTable(data) {
  console.log("The rendertable function was called" + Math.random());
  const table = document.getElementById("data-table");
  const tbody = table.querySelector("tbody");

  // Clear the existing table rows
  tbody.innerHTML = "";

  // Loop through the data and create a new row for each object
  data.forEach((row) => {
    const tr = document.createElement("tr");

    // Loop through the keys in each object and create a new cell for each value
    Object.keys(row).forEach((key) => {
      const td = document.createElement("td");
      td.textContent = row[key];
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  // change the value of span with id "row-count" to number of visible rows in the table
  const rowCount = $("#data-table tbody tr:visible").length;
  $("#row-count").text(rowCount);
}

// event listener for the import buttons
const importButtons = $(".import-button");
importButtons.each(function () {
  $(this).on("click", async (event) => {});
});
// Placeholder event listener for "Export" buttons
const exportButtons = document.querySelectorAll(".export-button");
exportButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const exportType = event.target.dataset.type;
    alert("Clicked export button for " + exportType);
    // TODO: Implement your export logic here based on the exportType
  });
});

// Function to use jQuery to turn the visible data from the table into a JSON object
function tableToJson(table) {
  var data = [];
  var headers = [];
  var checkboxes = document.querySelectorAll(".column-checkbox");

  // Collect the headers and check if the corresponding column checkbox is checked
  for (var i = 0; i < table.rows[0].cells.length; i++) {
    headers[i] = table.rows[0].cells[i].innerHTML
      .toLowerCase()
      .replace(/ /gi, "");
    if (checkboxes[i].checked) {
      // Only include the header if the corresponding checkbox is checked
      headers.push(headers[i]);
    }
  }

  // Go through rows and add the visible data
  for (var i = 1; i < table.rows.length; i++) {
    var tableRow = table.rows[i];
    var rowData = {};

    // Check if the row is visible
    if (tableRow.style.display !== "none") {
      for (var j = 0; j < tableRow.cells.length; j++) {
        if (checkboxes[j].checked) {
          // Only include the cell data if the corresponding checkbox is checked
          rowData[headers[j]] = tableRow.cells[j].innerHTML;
        }
      }

      data.push(rowData);
    }
  }

  return data;
}

async function insertData(tableName, data) {
  const values = data.map(
    (row) => `(${row.map((value) => `'${value}'`).join(", ")})`
  );
  const query = `INSERT INTO ${tableName} VALUES ${values.join(", ")}`;
  await database.executeQuery(query);
}
