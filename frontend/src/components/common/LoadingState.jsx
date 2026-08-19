import SkeletonLoader from '../ui/SkeletonLoader.jsx';

export default function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="skeleton h-8" />
      <SkeletonLoader lines={2} />
      <div className="skeleton h-32" />
      <div className="skeleton h-32" />
    </div>
  );
}
