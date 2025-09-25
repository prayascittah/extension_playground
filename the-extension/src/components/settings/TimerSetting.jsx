function TimerSetting({ label, value, setValue, min, max }) {
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex gap-5 w-full justify-between">
        <label className="text-sm text-black">{label}</label>
        <span className="text-sm text-black font-medium">
          {value.toString().padStart(2, "0")} min
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider text-sm"
      />
    </div>
  );
}

export default TimerSetting;
