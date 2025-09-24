import TimeBox from "./TimeBox";
import SecondsBox from "./SecondsBox";

function ClockDisplay({ time }) {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Hours Card */}
      <TimeBox value={time.getHours()} />

      {/* Minutes Card */}
      <div className="relative">
        <TimeBox value={time.getMinutes()} />
        <SecondsBox seconds={time.getSeconds()} />
      </div>
    </div>
  );
}

export default ClockDisplay;
