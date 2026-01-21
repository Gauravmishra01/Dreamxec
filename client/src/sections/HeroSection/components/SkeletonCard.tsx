export const SkeletonCard = () => {
  return (
    <div
      className="
        w-full
        h-full
        card-pastel rounded-2xl
        overflow-hidden
        flex flex-col
        animate-pulse
      "
    >
      {/* Image skeleton */}
      <div className="h-40 sm:h-48 w-full bg-gray-200 flex-shrink-0" />

      {/* Content skeleton */}
      <div className="p-4 sm:p-6 flex flex-col flex-1">
        {/* Header skeleton */}
        <div className="flex-shrink-0">
          <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
          <div className="h-5 w-full bg-gray-200 rounded mb-1" />
          <div className="h-5 w-3/4 bg-gray-200 rounded" />
        </div>

        {/* Spacer */}
        <div className="flex-1 min-h-[1rem]" />

        {/* Progress skeleton */}
        <div className="flex-shrink-0">
          <div className="flex justify-between mb-1">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full" />
        </div>

        {/* Button skeleton */}
        <div className="mt-4 sm:mt-6 h-10 w-full bg-gray-200 rounded-full flex-shrink-0" />
      </div>
    </div>
  );
};
