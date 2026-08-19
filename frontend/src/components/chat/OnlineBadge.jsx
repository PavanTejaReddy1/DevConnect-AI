export default function OnlineBadge({ isOnline }) {
  return (
    <div
      className={`w-3 h-3 rounded-full border-2 border-white ${
        isOnline ? 'bg-success' : 'bg-gray-400'
      }`}
    />
  );
}
