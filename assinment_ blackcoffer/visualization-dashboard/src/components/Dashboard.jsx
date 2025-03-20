import Filters from "./Filters.jsx";
import ChartCard from "./ChartCard.jsx";
import axios from "axios";
import { useState, useEffect } from "react";
import { debounce } from "lodash";

const Dashboard = ({ data: initialData, filters, onFilterChange, theme }) => {
  const [filteredData, setFilteredData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced function to fetch data
  const fetchFilteredData = debounce((params) => {
    setLoading(true);
    setError(null);
    axios
      .get("http://localhost:8000/api/data/", { params })
      .then((response) => {
        setFilteredData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching filtered data:", error);
        setError("Failed to load filtered data. Please try again.");
        setLoading(false);
      });
  }, 500); // Debounce for 500ms

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

    // Cleanup debounce on unmount
    return () => {
      fetchFilteredData.cancel();
    };
  }, [filters]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <Filters
          data={initialData}
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
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;