import { motion } from "framer-motion";

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </motion.button>
  );
};

export default ThemeToggle;