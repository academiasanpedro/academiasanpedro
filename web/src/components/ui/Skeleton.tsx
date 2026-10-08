import { cn } from "@/lib/utils";

export default function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-neutral-200/70", className)} aria-hidden="true" />;
}

/** Esqueleto genérico de página del área privada. */
export function PageSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="space-y-8" role="status" aria-label="Cargando">
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: cards }, (_, i) => (
          <Skeleton key={i} className="h-36 rounded-3xl" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-3xl" />
    </div>
  );
}
