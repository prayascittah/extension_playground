function SecondsBox({ seconds }) {
  return (
    <div className="absolute bottom-2 right-2 bg-black text-white text-sm font-bold px-2 py-1 rounded-md shadow-md">
      {seconds.toString().padStart(2, "0")}
    </div>
  );
}

export default SecondsBox;
