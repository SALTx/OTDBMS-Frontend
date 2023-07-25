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
