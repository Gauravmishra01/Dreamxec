export const SkeletonCard = () => {
  return (
    <div
      className="
        w-full
        h-full
        card-pastel-offwhite rounded-xl
        border-5 border-dreamxec-navy shadow-pastel-card
        overflow-hidden
        flex flex-col
        animate-pulse
        relative
      "
    >
      {/* Tricolor tag at the top */}
      <div className="card-tricolor-tag"></div>

      {/* Image skeleton */}
      <div className="relative w-full aspect-video mt-4 bg-gray-200 border-b-4 border-dreamxec-navy" />

      {/* Content skeleton */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Header skeleton */}
        <div className="mb-4 flex-shrink-0">
          <div className="h-6 w-full bg-gray-200 rounded mb-2" />
          <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
        </div>

        {/* Progress skeleton - stays at bottom */}
        <div className="space-y-3 mt-auto">
          <div className="flex justify-between">
            <div className="h-5 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="h-3 w-full bg-gray-200 rounded-full border-3 border-dreamxec-navy" />
          <div className="flex items-center justify-between">
            <div className="h-7 w-24 bg-gray-200 rounded-lg border-3 border-dreamxec-navy" />
            <div className="w-5 h-5 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};
