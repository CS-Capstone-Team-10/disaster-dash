import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2 bg-gray-800" />
        <Skeleton className="h-4 w-96 bg-gray-800" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-gray-900/50 border-gray-800/40 p-6">
            <Skeleton className="h-4 w-32 mb-4 bg-gray-800" />
            <Skeleton className="h-10 w-24 mb-2 bg-gray-800" />
            <Skeleton className="h-16 w-full bg-gray-800" />
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2 bg-gray-900/50 border-gray-800/40 p-6">
          <Skeleton className="h-6 w-48 mb-4 bg-gray-800" />
          <Skeleton className="h-80 w-full bg-gray-800" />
        </Card>
        <Card className="bg-gray-900/50 border-gray-800/40 p-6">
          <Skeleton className="h-6 w-48 mb-4 bg-gray-800" />
          <Skeleton className="h-64 w-full bg-gray-800" />
        </Card>
        <Card className="bg-gray-900/50 border-gray-800/40 p-6">
          <Skeleton className="h-6 w-48 mb-4 bg-gray-800" />
          <Skeleton className="h-64 w-full bg-gray-800" />
        </Card>
      </div>
    </div>
  );
}
