//* Event listener for the Course checkboxes
const courseCheckboxes = document.querySelectorAll(".course-checkbox");
courseCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const checkedCourses = Array.from(courseCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.dataset.course);

    const rows = document.querySelectorAll("tbody tr");

    rows.forEach((row) => {
      const rowCourse = row.querySelector("td:nth-child(7)").textContent;
      if (checkedCourses.includes(rowCourse)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
});
