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
import Plot from "react-plotly.js";

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

  // Chart.js options for line, bar, and pie charts
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

  // Plotly.js configuration for heatmap and sankey
  const plotlyColors = theme === "dark" ? {
    background: '#1f2937',
    text: '#ffffff',
    grid: '#374151',
    trace: ['#6366f1', '#f472b6', '#34d399', '#fb923c'],
  } : {
    background: '#ffffff',
    text: '#000000',
    grid: '#e5e7eb',
    trace: ['#3b82f6', '#ec4899', '#10b981', '#f59e0b'],
  };

  let plotlyData = [];
  let plotlyLayout = {
    title: {
      text: title,
      font: { color: plotlyColors.text },
    },
    paper_bgcolor: plotlyColors.background,
    plot_bgcolor: plotlyColors.background,
    font: { color: plotlyColors.text },
    margin: { t: 50, b: 50, l: 100, r: 50 }, // Increased left margin for y-axis labels
    autosize: true,
  };

  let hasValidData = false;
  let chartHeightClass = "h-64"; // Default height for most charts

  // Chart.js charts (line, bar, pie)
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
  } else if (title === "Intensity Heatmap (Regions vs Years)") {
    // Heatmap: Intensity across regions and years using Plotly
    const years = [...new Set(data.map(item => item.end_year))].filter(year => year !== "" && year >= 2000 && year <= 2100).sort();
    const regions = [...new Set(data.map(item => item.region))].filter(region => region !== "");
    const zValues = regions.map(region => 
      years.map(year => {
        const regionYearData = data.filter(item => item.region === region && item.end_year === year);
        const avgIntensity = regionYearData.length ? regionYearData.reduce((sum, item) => sum + (item.intensity || 0), 0) / regionYearData.length : 0;
        return avgIntensity;
      })
    );

    plotlyData = [{
      x: years,
      y: regions,
      z: zValues,
      type: 'heatmap',
      colorscale: 'Viridis',
      colorbar: {
        title: 'Intensity',
        titleside: 'right',
        titlefont: { color: plotlyColors.text },
        tickfont: { color: plotlyColors.text },
      },
    }];
    plotlyLayout = {
      ...plotlyLayout,
      xaxis: { 
        title: 'Year', 
        tickangle: 45, 
        gridcolor: plotlyColors.grid,
        tickfont: { color: plotlyColors.text },
      },
      yaxis: { 
        title: 'Region', 
        gridcolor: plotlyColors.grid,
        tickfont: { color: plotlyColors.text, size: 10 },
        automargin: true, // Ensure labels fit
      },
      height: regions.length * 30 + 200, // Dynamic height based on number of regions
    };
    hasValidData = years.length > 0 && regions.length > 0 && zValues.some(row => row.some(value => value > 0));
    chartHeightClass = `h-[${Math.max(400, regions.length * 30 + 200)}px]`; // Dynamic height for heatmap
  } else if (title === "Topic-Sector-Region Flow") {
    // Sankey Diagram: Topics -> Sectors -> Regions using Plotly
    const topics = [...new Set(data.map(item => item.topic))].filter(topic => topic !== "");
    const sectors = [...new Set(data.map(item => item.sector))].filter(sector => sector !== "");
    const regions = [...new Set(data.map(item => item.region))].filter(region => region !== "");

    // Create node labels (topics + sectors + regions)
    const labels = [...topics, ...sectors, ...regions];

    // Create source and target indices for links
    const source = [];
    const target = [];
    const value = [];
    const linkColors = [];

    // Topic -> Sector links
    topics.forEach((topic, topicIndex) => {
      sectors.forEach((sector, sectorIndex) => {
        const count = data.filter(item => item.topic === topic && item.sector === sector).length;
        if (count > 0) {
          source.push(topicIndex);
          target.push(topics.length + sectorIndex);
          value.push(count);
          linkColors.push(`hsl(${(topicIndex * 360) / topics.length}, 70%, 50%)`); // Color based on topic
        }
      });
    });

    // Sector -> Region links
    sectors.forEach((sector, sectorIndex) => {
      regions.forEach((region, regionIndex) => {
        const count = data.filter(item => item.sector === sector && item.region === region).length;
        if (count > 0) {
          source.push(topics.length + sectorIndex);
          target.push(topics.length + sectors.length + regionIndex);
          value.push(count);
          linkColors.push(`hsl(${(sectorIndex * 360) / sectors.length}, 70%, 50%)`); // Color based on sector
        }
      });
    });

    plotlyData = [{
      type: 'sankey',
      node: {
        pad: 15,
        thickness: 20,
        line: { color: plotlyColors.text, width: 0.5 },
        label: labels,
        color: plotlyColors.trace[0],
        labelFont: { size: 10, color: plotlyColors.text },
      },
      link: {
        source: source,
        target: target,
        value: value,
        color: linkColors, // Use dynamic colors for links
      },
    }];
    plotlyLayout = {
      ...plotlyLayout,
      height: Math.max(600, (topics.length + sectors.length + regions.length) * 15), // Dynamic height based on number of nodes
      font: { size: 10 },
    };
    hasValidData = source.length > 0 && target.length > 0 && value.some(val => val > 0);
    chartHeightClass = `h-[${Math.max(600, (topics.length + sectors.length + regions.length) * 15)}px]`; // Dynamic height for sankey
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
      <div className={chartHeightClass}>
        {data.length > 0 && hasValidData ? (
          <>
            {type === "line" && <Line data={chartData} options={options} />}
            {type === "bar" && <Bar data={chartData} options={options} />}
            {type === "pie" && <Pie data={chartData} options={options} />}
            {(type === "heatmap" || type === "sankey") && (
              <Plot
                data={plotlyData}
                layout={plotlyLayout}
                style={{ width: '100%', height: '100%' }}
                config={{ responsive: true }}
              />
            )}
          </>
        ) : (
          <div className={chartHeightClass + " flex items-center justify-center"}>
            <p className="text-gray-500 dark:text-gray-400">No Data Available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChartCard;