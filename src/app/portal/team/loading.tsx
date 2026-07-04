import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <Skeleton className="h-5 w-25 rounded-full" />
    </div>
  );
}
