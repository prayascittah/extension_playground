function SettingsActions({ onClose, onSave }) {
  return (
    <div className="flex justify-end gap-3">
      <button
        onClick={onClose}
        className="px-3 py-1.5 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors text-sm font-medium"
      >
        Close
      </button>
      <button
        onClick={onSave}
        className="px-3 py-1.5 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors text-sm font-medium"
      >
        Save
      </button>
    </div>
  );
}

export default SettingsActions;
