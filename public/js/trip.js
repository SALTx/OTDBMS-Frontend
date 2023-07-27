// Event listener for the Study Stage checkboxes
const studyStageCheckboxes = document.querySelectorAll(".study-stage-checkbox");
studyStageCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    // Get the checked study stages from the checkboxes
    const checkedStages = Array.from(studyStageCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.dataset.stage);

    const tripRows = document.querySelectorAll(
      ".checkbox-table + .trip-table tbody tr",
    );

    // Iterate over each row
    rows.forEach((row) => {
      // Get the study stage value from the fourth cell (td) in the current row
      const rowStage = row.querySelector("td:nth-child(4)").textContent;
      
      // Check if the study stage of the row is in the selected study stages
      if (checkedStages.includes(rowStage)) {
        // If the row's study stage is selected, display the row
        row.style.display = "";
      } else {
        // If the row's study stage is not selected, hide the row
        row.style.display = "none";
      }
    });
  });
});
