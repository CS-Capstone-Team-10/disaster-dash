import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function LiveMapLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2 bg-gray-800" />
        <Skeleton className="h-4 w-96 bg-gray-800" />
      </div>

      <div className="flex gap-3">
        <Skeleton className="h-10 w-48 bg-gray-800" />
        <Skeleton className="h-10 w-48 bg-gray-800" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <Card className="bg-gray-900/50 border-gray-800/40 p-4">
            <Skeleton className="h-6 w-48 mb-4 bg-gray-800" />
            <Skeleton className="h-[560px] w-full bg-gray-800" />
          </Card>
        </div>
        <div>
          <Card className="bg-gray-900/50 border-gray-800/40 p-4">
            <Skeleton className="h-6 w-32 mb-4 bg-gray-800" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-full bg-gray-800" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
