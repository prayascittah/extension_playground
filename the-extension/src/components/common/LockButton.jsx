import { LockKeyhole, LockKeyholeOpen } from "lucide-react";

function LockButton({
  isPinned,
  isLockHovered,
  setIsLockHovered,
  onLockClick,
}) {
  return (
    <button
      onMouseEnter={() => setIsLockHovered(true)}
      onMouseLeave={() => setIsLockHovered(false)}
      onClick={onLockClick}
      className={`p-2 rounded-lg transition-colors bg-gray-200 hover:bg-gray-300 text-black ${
        isPinned ? "bg-black text-white hover:bg-gray-800" : ""
      }`}
      title="LockIn"
    >
      {isPinned || isLockHovered ? (
        <LockKeyholeOpen size={16} />
      ) : (
        <LockKeyhole size={16} />
      )}
    </button>
  );
}

export default LockButton;
