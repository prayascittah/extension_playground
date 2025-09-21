function DateHeader({ time }) {
  return (
    <div className="text-gray-700 text-sm mb-3 font-bold text-center">
      {time.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      })}
    </div>
  );
}

export default DateHeader;
