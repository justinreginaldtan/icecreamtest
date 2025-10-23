import { Card, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CardSkeleton() {
  return (
    <Card className="border-[var(--border)] bg-[var(--surface)] shadow-sm rounded-xl">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-5 w-5 rounded" />
      </CardHeader>
    </Card>
  )
}
