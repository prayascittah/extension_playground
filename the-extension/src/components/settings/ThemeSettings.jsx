function ThemeSettings({
  selectedTheme,
  setSelectedTheme,
  themes,
  handleThemeHover,
  handleThemeSelect,
}) {
  return (
    <div className="mb-4">
      <h3 className="text-sm text-black mb-2">Theme</h3>
      <select
        value={selectedTheme}
        onChange={(e) => handleThemeSelect(e.target.value)}
        onFocus={(e) => handleThemeHover(e.target.value)}
        className="w-4/5 p-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:border-black"
      >
        {themes.map((theme) => (
          <option key={theme} value={theme}>
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ThemeSettings;
