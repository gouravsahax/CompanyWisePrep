export default function ProfileLoading() {
  return (
    <div className="flex-1 bg-background flex flex-col items-center py-12 px-6 page-fade-in animate-skeleton">
      <div className="w-full max-w-2xl space-y-8">
        
        <div className="flex items-center gap-4 border-b border-border/50 pb-6">
          <div className="w-12 h-12 rounded-full bg-muted border border-border/20"></div>
          <div>
            <div className="h-6 w-32 bg-muted rounded-sm mb-2"></div>
            <div className="h-4 w-48 bg-muted/50 rounded-sm"></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-4 w-16 bg-muted rounded-sm"></div>
            <div className="h-10 w-full bg-muted/50 rounded-sm border border-border/20"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded-sm"></div>
            <div className="h-10 w-full bg-muted/50 rounded-sm border border-border/20"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted rounded-sm"></div>
            <div className="h-10 w-full bg-muted/50 rounded-sm border border-border/20"></div>
          </div>
          
          <div className="pt-4">
            <div className="h-10 w-32 bg-muted rounded-sm border border-border/20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
