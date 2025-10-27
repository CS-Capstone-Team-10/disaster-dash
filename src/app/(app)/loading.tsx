import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48 bg-gray-800" />

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900/50 border-gray-800/40 p-6">
          <Skeleton className="h-4 w-32 mb-4 bg-gray-800" />
          <Skeleton className="h-10 w-24 mb-2 bg-gray-800" />
          <Skeleton className="h-16 w-full bg-gray-800" />
        </Card>
        <Card className="bg-gray-900/50 border-gray-800/40 p-6">
          <Skeleton className="h-4 w-32 mb-4 bg-gray-800" />
          <Skeleton className="h-10 w-24 mb-2 bg-gray-800" />
          <Skeleton className="h-16 w-full bg-gray-800" />
        </Card>
        <Card className="bg-gray-900/50 border-gray-800/40 p-6">
          <Skeleton className="h-4 w-32 mb-4 bg-gray-800" />
          <Skeleton className="h-10 w-24 mb-2 bg-gray-800" />
          <Skeleton className="h-16 w-full bg-gray-800" />
        </Card>
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-900/50 border-gray-800/40 p-4">
            <Skeleton className="h-6 w-48 mb-4 bg-gray-800" />
            <Skeleton className="h-96 w-full bg-gray-800" />
          </Card>
          <Card className="bg-gray-900/50 border-gray-800/40 p-4">
            <Skeleton className="h-6 w-48 mb-4 bg-gray-800" />
            <Skeleton className="h-64 w-full bg-gray-800" />
          </Card>
        </div>
        <div>
          <Card className="bg-gray-900/50 border-gray-800/40 p-4">
            <Skeleton className="h-6 w-32 mb-4 bg-gray-800" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full bg-gray-800" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
