interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl ${className}`}
      role="status"
      aria-label="Loading…"
    />
  );
}

export function MenuItemSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
      <Skeleton className="w-full h-48 rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  );
}
