import { Skeleton } from './ui/skeleton';

export function LoadingSkeleton() {
  return (
    <div className="px-6 py-6 space-y-4">
      <div className="space-y-3">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border border-gray-200 rounded-lg space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MapLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-4 space-y-3">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-96 w-full" />
      <div className="px-6 py-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}
