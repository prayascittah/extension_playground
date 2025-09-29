import { Pin } from "lucide-react";
import { motion } from "framer-motion";

function PinButton({ isPinPinned, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="p-2 rotate-35"
      title={isPinPinned ? "Unpin floating clock" : "Pin floating clock"}
      whileHover={{ y: -3, scale: 1.2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Pin
        size={16}
        className={`hover:fill-gray-300 transition-colors duration-200 ${
          isPinPinned ? "text-black fill-black" : "text-black"
        }`}
      />
    </motion.button>
  );
}

export default PinButton;
