import { motion } from "framer-motion";
import Select from "react-select";

const Filters = ({ data, filters, onFilterChange }) => {
  // Extract unique values for each filter
  const endYears = [
    ...new Set(
      data
        .map((item) => item.end_year)
        .filter((year) => year !== "")
    ),
  ].sort();
  const topics = [...new Set(data.map((item) => item.topic))];
  const sectors = [...new Set(data.map((item) => item.sector))];
  const pestles = [...new Set(data.map((item) => item.pestle))];
  const sources = [...new Set(data.map((item) => item.source))];
  const countries = [...new Set(data.map((item) => item.country))];
  const regions = [...new Set(data.map((item) => item.region))];

  // Options for react-select
  const endYearOptions = [
    { value: "All", label: "All" },
    ...endYears.map((year) => ({ value: year, label: year })),
  ];
  const topicOptions = [
    { value: "All", label: "All" },
    ...topics.map((topic) => ({ value: topic, label: topic })),
  ];
  const sectorOptions = [
    { value: "All", label: "All" },
    ...sectors.map((sector) => ({ value: sector, label: sector })),
  ];
  const pestleOptions = [
    { value: "All", label: "All" },
    ...pestles.map((pestle) => ({ value: pestle, label: pestle })),
  ];
  const sourceOptions = [
    { value: "All", label: "All" },
    ...sources.map((source) => ({ value: source, label: source })),
  ];
  const countryOptions = [
    { value: "All", label: "All" },
    ...countries.map((country) => ({ value: country, label: country })),
  ];
  const regionOptions = [
    { value: "All", label: "All" },
    ...regions.map((region) => ({ value: region, label: region })),
  ];

  // Custom styles for react-select to match the theme
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "var(--select-bg, #f3f4f6)",
      color: "var(--select-text, #111827)",
      borderColor: "var(--select-border, #d1d5db)",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "var(--select-bg, #f3f4f6)",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "var(--select-selected, #3b82f6)"
        : state.isFocused
        ? "var(--select-hover, #e5e7eb)"
        : "var(--select-bg, #f3f4f6)",
      color: state.isSelected ? "#ffffff" : "var(--select-text, #111827)",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "var(--select-text, #111827)",
    }),
  };

  // Reset filters
  const resetFilters = () => {
    onFilterChange("endYear", "All");
    onFilterChange("topic", "All");
    onFilterChange("sector", "All");
    onFilterChange("pestle", "All");
    onFilterChange("source", "All");
    onFilterChange("country", "All");
    onFilterChange("region", "All");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-transparent dark:border-gray-700"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Filters
        </h2>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Reset
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            End Year
          </label>
          <Select
            options={endYearOptions}
            value={endYearOptions.find(
              (option) => option.value === filters.endYear
            )}
            onChange={(option) => onFilterChange("endYear", option.value)}
            styles={customStyles}
            classNamePrefix="react-select"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Topic
          </label>
          <Select
            options={topicOptions}
            value={topicOptions.find((option) => option.value === filters.topic)}
            onChange={(option) => onFilterChange("topic", option.value)}
            styles={customStyles}
            classNamePrefix="react-select"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Sector
          </label>
          <Select
            options={sectorOptions}
            value={sectorOptions.find(
              (option) => option.value === filters.sector
            )}
            onChange={(option) => onFilterChange("sector", option.value)}
            styles={customStyles}
            classNamePrefix="react-select"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            PESTLE
          </label>
          <Select
            options={pestleOptions}
            value={pestleOptions.find(
              (option) => option.value === filters.pestle
            )}
            onChange={(option) => onFilterChange("pestle", option.value)}
            styles={customStyles}
            classNamePrefix="react-select"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Source
          </label>
          <Select
            options={sourceOptions}
            value={sourceOptions.find(
              (option) => option.value === filters.source
            )}
            onChange={(option) => onFilterChange("source", option.value)}
            styles={customStyles}
            classNamePrefix="react-select"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Country
          </label>
          <Select
            options={countryOptions}
            value={countryOptions.find(
              (option) => option.value === filters.country
            )}
            onChange={(option) => onFilterChange("country", option.value)}
            styles={customStyles}
            classNamePrefix="react-select"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Region
          </label>
          <Select
            options={regionOptions}
            value={regionOptions.find(
              (option) => option.value === filters.region
            )}
            onChange={(option) => onFilterChange("region", option.value)}
            styles={customStyles}
            classNamePrefix="react-select"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Filters;