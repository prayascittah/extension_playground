import themes from "../../constants/themes";

function ThemeSettings({
  selectedTheme,
  setSelectedTheme,
  handleThemeHover,
  handleThemeSelect,
}) {
  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm text-black">Theme: </span>
      <select
        value={selectedTheme}
        onChange={(e) => handleThemeSelect(e.target.value)}
        onFocus={(e) => handleThemeHover(e.target.value)}
        className="p-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:border-black w-32"
      >
        {themes.map((theme) => (
          <option key={theme} value={theme} className="text-sm px-2">
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ThemeSettings;
