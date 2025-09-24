function PomodoroTimerSetting({ pomodoroTime, setPomodoroTime }) {
  return (
    <span className="flex flex-col items-center w-4/5">
      <div className="flex gap-5 w-full justify-between">
        <label className="text-xs text-black mb-3">Pomodoro time</label>
        <span className="text-xs text-black font-medium">
          {pomodoroTime.toString().padStart(2, "0")} min
        </span>
      </div>
      <input
        type="range"
        min="1"
        max="60"
        value={pomodoroTime}
        onChange={(e) => setPomodoroTime(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
    </span>
  );
}

export default PomodoroTimerSetting;
