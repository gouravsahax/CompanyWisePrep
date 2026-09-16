export default function CompanyLoading() {
  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-12 animate-skeleton page-fade-in">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row gap-6 md:items-end border-b border-border/50 pb-8">
          <div className="w-24 h-24 rounded-sm bg-muted shrink-0 border border-border/50"></div>
          <div className="flex-1 space-y-3">
            <div className="h-8 w-48 bg-muted rounded-sm"></div>
            <div className="flex gap-2">
              <div className="h-5 w-20 bg-muted rounded-sm"></div>
              <div className="h-5 w-24 bg-muted rounded-sm"></div>
            </div>
          </div>
        </div>

        {/* Roles Tab Skeleton */}
        <div className="flex gap-2 border-b border-border/50 pb-px">
          <div className="h-10 w-32 bg-muted rounded-t-lg"></div>
          <div className="h-10 w-40 bg-muted/50 rounded-t-lg"></div>
          <div className="h-10 w-36 bg-muted/50 rounded-t-lg"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="h-6 w-48 bg-muted rounded-sm mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 w-full bg-muted/30 border border-border/50 rounded-sm"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="h-6 w-32 bg-muted rounded-sm mb-4"></div>
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-20 w-full bg-muted/30 border border-border/50 rounded-sm"></div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
