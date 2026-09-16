export default function Loading() {
  return (
    <div className="flex-1 flex overflow-hidden animate-skeleton">
      
      {/* Left Sidebar Skeleton (My Companies) */}
      <aside className="w-64 border-r border-border hidden lg:flex flex-col p-4 shrink-0">
        <div className="h-4 w-24 bg-muted rounded-sm mb-4"></div>
        <div className="flex flex-col gap-1">
          <div className="h-9 w-full bg-muted rounded-sm"></div>
          <div className="h-9 w-full bg-muted rounded-sm"></div>
          <div className="h-9 w-full bg-muted rounded-sm"></div>
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* 3 Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="aspect-video bg-muted rounded-sm"></div>
          <div className="aspect-video bg-muted rounded-sm"></div>
          <div className="aspect-video bg-muted rounded-sm"></div>
        </div>
        
        {/* Search Bar */}
        <div className="h-9 w-full max-w-md bg-muted rounded-sm"></div>

        {/* Company List */}
        <div className="border border-border rounded-sm">
          <div className="h-12 border-b border-border bg-muted/50"></div>
          {[1,2,3,4,5].map(i => <div key={i} className="h-12 border-b border-border bg-muted/20"></div>)}
        </div>
      </main>

      {/* Right Sidebar Skeleton */}
      <aside className="w-72 border-l border-border hidden xl:flex flex-col p-6 space-y-6 shrink-0">
        {/* Right Banner */}
        <div className="aspect-video w-full bg-muted rounded-sm"></div>
        
        {/* Top 5 Trending Companies */}
        <div className="border border-border rounded-sm p-4 space-y-4">
          <div className="h-5 w-32 bg-muted rounded-sm"></div>
          <div className="flex flex-col gap-2">
            {[1,2,3,4,5].map(i => <div key={i} className="h-8 w-full bg-muted rounded-sm"></div>)}
          </div>
        </div>
      </aside>

    </div>
  );
}
