import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { handleLock } from "../../utils/utils";

function LockButton() {
  const { isLockInMode, isLockHovered, setIsLockHovered } = useAppStore();
  return (
    <button
      onMouseEnter={() => setIsLockHovered(true)}
      onMouseLeave={() => setIsLockHovered(false)}
      onClick={handleLock}
      className={`p-2 rounded-lg transition-colors bg-gray-200 hover:bg-gray-300 text-black ${
        isLockInMode ? "bg-black text-white hover:bg-gray-800" : ""
      }`}
      title="LockIn"
    >
      {isLockInMode || isLockHovered ? (
        <LockKeyholeOpen size={16} />
      ) : (
        <LockKeyhole size={16} />
      )}
    </button>
  );
}

export default LockButton;
