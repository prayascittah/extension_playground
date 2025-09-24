function BreakTimerSetting({ breakTime, setBreakTime }) {
  return (
    <div className="flex flex-col items-center w-4/5">
      <div className="flex gap-5 w-full justify-between">
        <label className="text-xs text-black mb-3">Break time</label>
        <span className="text-xs text-black font-medium">
          {breakTime.toString().padStart(2, "0")} min
        </span>
      </div>
      <input
        type="range"
        min="1"
        max="30"
        value={breakTime}
        onChange={(e) => setBreakTime(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );
}

export default BreakTimerSetting;
