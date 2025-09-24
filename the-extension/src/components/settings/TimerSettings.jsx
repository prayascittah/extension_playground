function TimerSettings({
  pomodoroTime,
  setPomodoroTime,
  breakTime,
  setBreakTime,
}) {
  return (
    <div className="flex items-center gap-8">
      {/* Pomodoro Time */}
      <div className="flex flex-col items-center">
        <div className="flex gap-5">
          <label className="text-xs text-black mb-3">Pomodoro time</label>
          <span className="text-xs text-black font-medium">
            {pomodoroTime.toString().padStart(2, "0")} min
          </span>
        </div>
        <div className="flex items-center gap-2 w-full">
          <input
            type="range"
            min="1"
            max="60"
            value={pomodoroTime}
            onChange={(e) => setPomodoroTime(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Break Time */}
      <div className="flex flex-col items-center flex-1">
        <div className="flex gap-5">
          <label className="text-xs text-black mb-3">Break time</label>
          <span className="text-xs text-black font-medium">
            {breakTime.toString().padStart(2, "0")} min
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 w-full">
          <input
            type="range"
            min="1"
            max="30"
            value={breakTime}
            onChange={(e) => setBreakTime(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>
    </div>
  );
}

export default TimerSettings;
