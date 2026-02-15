function ThemeToggle({ darkMode, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      className={darkMode ? "btn btn-light" : "btn btn-dark"}
    >
      {darkMode ? "Light Mode ☀" : "Dark Mode 🌙"}
    </button>
  );
}

export default ThemeToggle;
