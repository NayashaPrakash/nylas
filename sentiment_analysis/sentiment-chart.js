import output from "./sentiment.js";

const ctx = document.getElementById("myChart");
const sent = document.getElementById("sentiment");

async function sentiment_analysis_data() {
  try {
    const response = await output("the food tasted bad");
    sent.innerHTML = response;
    const parsedResponse = JSON.parse(response); // Parse the JSON response

    const labelColors = {
      positive: "green",
      negative: "red",
      neutral: "blue",
    };

    // Extract labels and scores from the parsed response
    const data = parsedResponse[0].map((item) => ({
      label: item.label,
      score: item.score,
      color: labelColors[item.label.toLowerCase()], // Assign color based on label
    }));

    console.log(data); // Log the extracted data
    return data;
  } catch (error) {
    console.error("Error in sentiment_analysis_data:", error);
    throw error; // Rethrow the error to handle it elsewhere if needed
  }
}

async function bar_graph() {
  const data = await sentiment_analysis_data();
  console.log(data);

  var xValues = [data[0].label, data[1].label, data[2].label];
  var yValues = [data[0].score, data[1].score, data[2].score];
  var barColors = [data[0].color, data[1].color, data[2].color];
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [
        {
          label: "# of Votes",
          data: yValues,
          borderWidth: 1,
          backgroundColor: barColors,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

bar_graph();
