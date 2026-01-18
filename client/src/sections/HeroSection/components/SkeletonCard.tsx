export const SkeletonCard = () => {
  return (
    <div
      aria-hidden="true"
      className="min-w-[280px] md:min-w-[320px] rounded-2xl bg-black/5 animate-pulse overflow-hidden"
    >
      {/* Image placeholder */}
      <div className="h-40 bg-black/10" />

      {/* Content placeholders */}
      <div className="p-6 space-y-4">
        <div className="h-3 w-24 bg-black/10 rounded" />
        <div className="h-4 w-full bg-black/10 rounded" />
        <div className="h-4 w-3/4 bg-black/10 rounded" />
        <div className="h-2 w-full bg-black/10 rounded" />
        <div className="h-9 w-full bg-black/10 rounded-full" />
      </div>
    </div>
  );
};
