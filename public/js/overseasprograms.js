//* Event listener for the Program Type checkboxes
const programTypeCheckboxes = document.querySelectorAll(
  ".program-type-checkbox"
);
programTypeCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const selectedTypes = Array.from(programTypeCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.dataset.type);

    const rows = document.querySelectorAll("tbody tr");

    rows.forEach((row) => {
      const rowType = row.querySelector("td:nth-child(3)").textContent;
      if (selectedTypes.includes(rowType)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
});

// populate the select box
$(document).ready(function () {
  // Get the countries from the API
  $.get("/api/countries", function (countries) {
    console.log(countries);
    // Loop through the countries and add an option for each one
    countries.forEach(function (country) {
      $("#country-select").append(
        $("<option>", {
          value: country.id,
          text: country.name,
        })
      );
    });
  });
});
