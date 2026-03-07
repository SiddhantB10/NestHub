export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="skeleton h-48 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="flex gap-2 mt-3">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
        <div className="flex justify-between mt-4">
          <div className="skeleton h-5 w-24 rounded" />
          <div className="skeleton h-8 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="skeleton h-8 w-64 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="skeleton h-80 rounded-2xl" />
        <div className="grid grid-cols-2 gap-2">
          <div className="skeleton h-[9.5rem] rounded-xl" />
          <div className="skeleton h-[9.5rem] rounded-xl" />
          <div className="skeleton h-[9.5rem] rounded-xl" />
          <div className="skeleton h-[9.5rem] rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-5/6 rounded" />
          <div className="skeleton h-4 w-4/6 rounded" />
        </div>
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    </div>
  );
}

export function SkeletonLine({ width = 'w-full', height = 'h-4' }) {
  return <div className={`skeleton ${width} ${height} rounded`} />;
}
