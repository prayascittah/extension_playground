import { Pin } from "lucide-react";

function PinButton({ isPinPinned, onPinClick }) {
  return (
    <div className="flex justify-start items-start">
      <button
        onClick={onPinClick}
        className={`p-2 rounded-lg transition-all duration-300 ${
          isPinPinned
            ? "bg-red-500 hover:bg-red-600 text-white rotate-45 hover:rotate-0"
            : "bg-gray-200 hover:bg-gray-300 text-black rotate-45 hover:rotate-0"
        }`}
        title={isPinPinned ? "Unpin floating clock" : "Pin floating clock"}
      >
        <Pin size={16} />
      </button>
    </div>
  );
}

export default PinButton;
