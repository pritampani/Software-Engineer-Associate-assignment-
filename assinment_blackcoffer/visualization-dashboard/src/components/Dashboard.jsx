import Filters from "./Filters.jsx";
import ChartCard from "./ChartCard.jsx";
import axios from "axios";
import { useState, useEffect } from "react";
import { debounce } from "lodash";

const Dashboard = ({ filters, onFilterChange, theme }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = "/api/data/";

  // Debounced function to fetch data
  const fetchFilteredData = debounce((params) => {
    setLoading(true);
    setError(null);
    axios
      .get(API_URL, { params })
      .then((response) => {
        setFilteredData(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching filtered data:", error);
        setError("Failed to load filtered data. Please try again.");
        setLoading(false);
      });
  }, 500);

  useEffect(() => {
    const params = {};
    if (filters.endYear !== "All") params.end_year = filters.endYear;
    if (filters.topic !== "All") params.topic = filters.topic;
    if (filters.sector !== "All") params.sector = filters.sector;
    if (filters.pestle !== "All") params.pestle = filters.pestle;
    if (filters.source !== "All") params.source = filters.source;
    if (filters.country !== "All") params.country = filters.country;
    if (filters.region !== "All") params.region = filters.region;

    fetchFilteredData(params);

    return () => {
      fetchFilteredData.cancel();
    };
  }, [filters]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <Filters
          data={filteredData}
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </div>
      <div className="md:col-span-3 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>
            <ChartCard
              title="Intensity Over Years"
              data={filteredData}
              type="line"
              theme={theme}
            />
            <ChartCard
              title="Likelihood by Region"
              data={filteredData}
              type="bar"
              theme={theme}
            />
            <ChartCard
              title="Relevance by Country"
              data={filteredData}
              type="bar"
              theme={theme}
            />
            <ChartCard
              title="Topic Distribution"
              data={filteredData}
              type="pie"
              theme={theme}
            />
            <ChartCard
              title="Intensity Heatmap (Regions vs Years)"
              data={filteredData}
              type="heatmap"
              theme={theme}
            />
            <ChartCard
              title="Topic-Sector-Region Flow"
              data={filteredData}
              type="sankey"
              theme={theme}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;