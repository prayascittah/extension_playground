import DateHeader from "./DateHeader";
import ClockDisplay from "./ClockDisplay";
import Signature from "./Signature";

function MiddleSection({ time }) {
  return (
    <div className="flex-1 flex flex-col justify-between items-center">
      <div></div> {/* Spacer */}
      
      <div className="flex flex-col items-center">
        <DateHeader time={time} />
        <ClockDisplay time={time} />
      </div>
      
      <Signature />
    </div>
  );
}

export default MiddleSection;
