function BreakTimerDisplay({ displayTime = "00:00" }) {
  return (
    <div className="text-2xl font-medium text-black mb-2 tracking-wider">
      {displayTime}
    </div>
  );
}

export default BreakTimerDisplay;
