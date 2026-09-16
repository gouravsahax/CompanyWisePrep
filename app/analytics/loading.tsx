export default function AnalyticsLoading() {
  return (
    <div className="min-h-screen bg-background font-sans page-fade-in text-foreground pb-20 animate-skeleton">
      <div className="max-w-4xl mx-auto px-6 mt-12 space-y-12">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border border-border/20"></div>
            <div className="space-y-2">
              <div className="h-6 w-48 bg-muted rounded-sm"></div>
              <div className="h-4 w-64 bg-muted/50 rounded-sm"></div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border/50 rounded-sm overflow-hidden shadow-sm">
              <div className="p-8 border-b border-border/50 bg-muted/5">
                <div className="h-5 w-32 bg-muted rounded-sm mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-muted rounded-sm"></div>
                  <div className="h-6 w-24 bg-muted rounded-sm"></div>
                  <div className="h-6 w-16 bg-muted rounded-sm"></div>
                </div>
              </div>
              <div className="p-8 border-b border-border/50 bg-muted/5">
                <div className="h-5 w-32 bg-muted rounded-sm mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-24 bg-muted rounded-sm"></div>
                  <div className="h-6 w-20 bg-muted rounded-sm"></div>
                </div>
              </div>
              <div className="p-8 bg-muted/5">
                <div className="h-5 w-32 bg-muted rounded-sm mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-28 bg-muted rounded-sm"></div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-sm p-8 shadow-sm">
              <div className="h-6 w-48 bg-muted rounded-sm mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-muted/50 rounded-sm"></div>
                <div className="h-4 w-11/12 bg-muted/50 rounded-sm"></div>
                <div className="h-4 w-full bg-muted/50 rounded-sm"></div>
                <div className="h-4 w-4/5 bg-muted/50 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
