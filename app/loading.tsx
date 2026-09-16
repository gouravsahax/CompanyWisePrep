import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh] page-fade-in">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );
}
