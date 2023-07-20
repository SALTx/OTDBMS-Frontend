$(document).ready(() => {
  renderKpiGraph(1);
  renderKpiGraph(2);
  renderKpiGraph(3);
});

function renderKpiGraph(kpiNumber) {
  $.ajax({
    url: `/database/views/kpi/${kpiNumber}`,
    type: "GET",
    success: (data) => {
      const description = data.pop()["Number of Students"];
      // remove the last row of total students
      data.pop();
      const courseNames = data.map((row) => row["Course Name"]);
      const numStudents = data.map((row) => row["Number of Students"]);

      $(`#kpi${kpiNumber}description`).text(`Description: ${description}`);

      const ctx = document
        .getElementById(`kpi${kpiNumber}Chart`)
        .getContext("2d");
      const kpiChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: courseNames,
          datasets: [
            {
              label: "Number of Students",
              data: numStudents,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: true,
              labels: {
                // Set the legend labels to be clickable
                interactive: true,
              },
            },
          },
          onClick: (event, element) => {
            const chart = element.chart;
            const datasetIndex = element.datasetIndex;
            const meta = chart.getDatasetMeta(datasetIndex);
            const hidden = meta.hidden === null ? false : !meta.hidden;

            meta.hidden = hidden;
            chart.update();
          },
        },
      });
    },
  });
}
