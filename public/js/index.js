$(document).ready(() => {
  renderKpiGraph(1);
  renderKpiGraph(2);
  renderKpiGraph(3);
});

const kpi1Expected = [];
const kpi2Expected = [];
const kpi3Expected = [];

for (let i = 0; i < 10; i++) {
  kpi1Expected.push(Math.floor(Math.random() * 100));
  kpi2Expected.push(Math.floor(Math.random() * 100));
  kpi3Expected.push(Math.floor(Math.random() * 100));
}

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
      const expected = data.map((row) => row["Estimated"]);
      console.log(expected);

      $(`#kpi${kpiNumber}description`).text(`Description: ${description}`);

      const ctx = document
        .getElementById(`kpi${kpiNumber}Chart`)
        .getContext("2d");
      const kpiChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: courseNames,
          datasets: [
            {
              label: "Actual",
              data: numStudents,
              // backgroundColor: "rgba(255, 99, 132, 0.2)",
              // background color different if this value is greater than expected
              backgroundColor: numStudents.map((num, index) => {
                if (num > expected[index]) {
                  return "rgba(99, 255, 132, 0.4)";
                } else {
                  return "rgba(255, 19, 132, 0.2)";
                }
              }),
              borderColor: numStudents.map((num, index) => {
                if (num > expected[index]) {
                  return "rgba(19, 255, 132, 0.2)";
                } else {
                  return "rgba(255, 99, 132, 1)";
                }
              }),
              borderWidth: 1,
            },
            {
              label: "Target",
              data: expected,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
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
            datalabels: {
              // Display the value of each bar as a label
              display: true,
              color: "white",
              font: {
                weight: "bold",
              },
              formatter: (value) => {
                return value;
              },
            },
          },
          onClick: (event, element) => {
            const chart = element.chart;
            if (chart) {
              const datasetIndex = element.datasetIndex;
              const meta = chart.getDatasetMeta(datasetIndex);
              const hidden = meta.hidden === null ? false : !meta.hidden;

              meta.hidden = hidden;
              chart.update();
            }
          },
        },
      });
      console.log(kpiChart);
    },
  });
}
