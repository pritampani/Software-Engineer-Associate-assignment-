import { motion } from "framer-motion";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChartCard = ({ title, data, type, theme }) => {
  const textColor = theme === "dark" ? "gray" : "#4b5563";
  const gridColor = theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

  let chartData = {};
  let options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: textColor,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)",
        titleColor: theme === "dark" ? "#ffffff" : "#000000",
        bodyColor: theme === "dark" ? "#ffffff" : "#000000",
        borderColor: theme === "dark" ? "#ffffff" : "#000000",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
      y: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
    },
  };

  let hasValidData = false;

  if (title === "Intensity Over Years") {
    const years = [
      ...new Set(
        data
          .map((item) => item.end_year)
          .filter((year) => year !== "")
      ),
    ].sort();
    const intensities = years.map((year) =>
      data
        .filter((item) => item.end_year === year)
        .reduce((sum, item) => sum + item.intensity, 0)
    );

    chartData = {
      labels: years,
      datasets: [
        {
          label: "Intensity",
          data: intensities,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          tension: 0.1,
        },
      ],
    };
    hasValidData = years.length > 0 && intensities.some((value) => value > 0);
  } else if (title === "Likelihood by Region") {
    const regions = [...new Set(data.map((item) => item.region))];
    const likelihoods = regions.map((region) =>
      data
        .filter((item) => item.region === region)
        .reduce((sum, item) => sum + item.likelihood, 0)
    );

    chartData = {
      labels: regions,
      datasets: [
        {
          label: "Likelihood",
          data: likelihoods,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgb(255, 99, 132)",
          borderWidth: 1,
        },
      ],
    };
    hasValidData = regions.length > 0 && likelihoods.some((value) => value > 0);
  } else if (title === "Relevance by Country") {
    const countries = [...new Set(data.map((item) => item.country))];
    const relevances = countries.map((country) =>
      data
        .filter((item) => item.country === country)
        .reduce((sum, item) => sum + item.relevance, 0)
    );

    chartData = {
      labels: countries,
      datasets: [
        {
          label: "Relevance",
          data: relevances,
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgb(54, 162, 235)",
          borderWidth: 1,
        },
      ],
    };
    hasValidData = countries.length > 0 && relevances.some((value) => value > 0);
  } else if (title === "Topic Distribution") {
    const topics = [...new Set(data.map((item) => item.topic))];
    const topicCounts = topics.map((topic) =>
      data.filter((item) => item.topic === topic).length
    );

    const totalCount = topicCounts.reduce((sum, count) => sum + count, 0);
    const threshold = totalCount * 0.02;
    const groupedTopics = [];
    const groupedCounts = [];
    let otherCount = 0;

    topics.forEach((topic, index) => {
      if (topicCounts[index] < threshold) {
        otherCount += topicCounts[index];
      } else {
        groupedTopics.push(topic);
        groupedCounts.push(topicCounts[index]);
      }
    });

    if (otherCount > 0) {
      groupedTopics.push("Other");
      groupedCounts.push(otherCount);
    }

    chartData = {
      labels: groupedTopics,
      datasets: [
        {
          label: "Topics",
          data: groupedCounts,
          backgroundColor: groupedTopics.map(
            (_, index) =>
              `hsl(${(index * 360) / groupedTopics.length}, 70%, 50%)`
          ),
          borderColor: groupedTopics.map(
            (_, index) =>
              `hsl(${(index * 360) / groupedTopics.length}, 70%, 40%)`
          ),
          borderWidth: 1,
        },
      ],
    };
    options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: textColor,
          },
        },
        title: {
          display: false,
        },
        tooltip: {
          enabled: true,
          backgroundColor: theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)",
          titleColor: theme === "dark" ? "#ffffff" : "#000000",
          bodyColor: theme === "dark" ? "#ffffff" : "#000000",
          borderColor: theme === "dark" ? "#ffffff" : "#000000",
          borderWidth: 1,
        },
      },
    };
    hasValidData = groupedTopics.length > 0 && groupedCounts.some((value) => value > 0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-transparent dark:border-gray-700 transition-transform"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {title}
      </h3>
      <div className="h-64">
        {data.length > 0 && hasValidData ? (
          <>
            {type === "line" && <Line data={chartData} options={options} />}
            {type === "bar" && <Bar data={chartData} options={options} />}
            {type === "pie" && <Pie data={chartData} options={options} />}
          </>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">No Data Available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChartCard;