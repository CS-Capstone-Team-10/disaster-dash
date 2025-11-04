import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function NotificationsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2 bg-gray-800" />
        <Skeleton className="h-4 w-96 bg-gray-800" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 border-gray-800/40 p-6">
          <Skeleton className="h-6 w-48 mb-6 bg-gray-800" />
          <div className="space-y-6">
            <Skeleton className="h-32 w-full bg-gray-800" />
            <Skeleton className="h-32 w-full bg-gray-800" />
          </div>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800/40 p-6">
          <Skeleton className="h-6 w-48 mb-6 bg-gray-800" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 w-full bg-gray-800" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
