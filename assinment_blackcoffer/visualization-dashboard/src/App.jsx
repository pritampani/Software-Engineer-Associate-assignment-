import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import data from "./data/jsondata.json";

function App() {
  const [theme, setTheme] = useState("light");
  const [dashboardData, setDashboardData] = useState([]);
  const [filters, setFilters] = useState({
    endYear: "All",
    topic: "All",
    sector: "All",
    pestle: "All",
    source: "All",
    country: "All",
    region: "All",
  });

  useEffect(() => {
    setDashboardData(data);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 to-gray-700 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Visualization Dashboard</h1>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
        <Dashboard
          data={dashboardData}
          filters={filters}
          onFilterChange={handleFilterChange}
          theme={theme} // Pass the theme
        />
      </div>
    </div>
  );
}

export default App;