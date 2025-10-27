import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function AlertsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2 bg-gray-800" />
        <Skeleton className="h-4 w-96 bg-gray-800" />
      </div>

      <Card className="bg-gray-900/50 border-gray-800/40 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full bg-gray-800" />
          ))}
        </div>
      </Card>

      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} className="bg-gray-900/50 border-gray-800/40 p-4">
            <Skeleton className="h-20 w-full bg-gray-800" />
          </Card>
        ))}
      </div>
    </div>
  );
}
