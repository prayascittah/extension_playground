function TimeBox({ value, size = "large" }) {
  const sizeClasses = {
    large: "text-6xl p-6",
    small: "text-sm px-2 py-1"
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-300 relative">
      <div className={`font-bold text-black tabular-nums leading-none ${sizeClasses[size]}`}>
        {value.toString().padStart(2, "0")}
      </div>
    </div>
  );
}

export default TimeBox;
