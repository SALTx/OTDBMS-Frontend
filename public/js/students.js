//* Event listener for the Citizenship Status checkboxes
const citizenshipCheckboxes = document.querySelectorAll(
  ".citizenship-checkbox"
);
citizenshipCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const statuses = Array.from(citizenshipCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.dataset.status);

    const rows = document.querySelectorAll("tbody tr");

    rows.forEach((row) => {
      const rowStatus = row.querySelector("td:nth-child(3)").textContent;
      if (statuses.includes(rowStatus)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
});

//* Event listener for the Study Stage checkboxes
const studyStageCheckboxes = document.querySelectorAll(".study-stage-checkbox");
studyStageCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const checkedStages = Array.from(studyStageCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.dataset.stage);

    const rows = document.querySelectorAll("tbody tr");

    rows.forEach((row) => {
      const rowStage = row.querySelector("td:nth-child(4)").textContent;
      if (checkedStages.includes(rowStage)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });

  //* Event listener for the Course checkboxes
  const courseCheckboxes = document.querySelectorAll(".course-checkbox");
  courseCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const checkedCourses = Array.from(courseCheckboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.dataset.course);

      const rows = document.querySelectorAll("tbody tr");

      rows.forEach((row) => {
        const rowCourse = row.querySelector("td:nth-child(5)").textContent;
        if (checkedCourses.includes(rowCourse)) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });
  });
});
