// Event listener for the Study Stage checkboxes
const studyStageCheckboxes = document.querySelectorAll(".study-stage-checkbox");
studyStageCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const checkedStages = Array.from(studyStageCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => parseInt(checkbox.dataset.stage));

    const tripRows = document.querySelectorAll(
      ".checkbox-table + .trip-table tbody tr",
    );

    tripRows.forEach((row) => {
      const rowStage = parseInt(row.querySelector("td").textContent);
      if (checkedStages.includes(rowStage)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
});
