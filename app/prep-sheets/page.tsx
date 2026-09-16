import { FileText, Download, Lock } from "lucide-react";

export default function PrepSheetsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto w-full space-y-8 page-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-2">Company × Role Prep Sheets</h1>
        <p className="text-muted-foreground text-sm">Detailed preparation packs containing assessment intelligence, topics, and past patterns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Sheet Card */}
        <div className="border border-border bg-card rounded-sm flex flex-col">
          <div className="p-6 flex-1 space-y-4">
            <div className="w-10 h-10 bg-primary/10 rounded-sm flex items-center justify-center">
              <FileText className="text-primary w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Google SDE</h3>
              <p className="text-xs text-muted-foreground mt-1">Updated for 2024 Hiring Season</p>
            </div>
            <ul className="text-sm space-y-2 text-foreground/80">
              <li className="flex items-center gap-2">• Common OA Topics & Frequencies</li>
              <li className="flex items-center gap-2">• Expected Difficulty Distribution</li>
              <li className="flex items-center gap-2">• Recent Assessment Patterns</li>
            </ul>
          </div>
          <div className="p-4 border-t border-border flex items-center justify-between bg-muted/30">
            <span className="font-medium">1 Credit</span>
            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 rounded-sm text-sm font-medium hover:bg-primary/90">
              <Lock className="w-4 h-4" /> Unlock
            </button>
          </div>
        </div>

        {/* Sheet Card */}
        <div className="border border-border bg-card rounded-sm flex flex-col">
          <div className="p-6 flex-1 space-y-4">
            <div className="w-10 h-10 bg-primary/10 rounded-sm flex items-center justify-center">
              <FileText className="text-primary w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Amazon SDE I</h3>
              <p className="text-xs text-muted-foreground mt-1">Includes Leadership Principles guide</p>
            </div>
            <ul className="text-sm space-y-2 text-foreground/80">
              <li className="flex items-center gap-2">• Coding & Work Simulation Info</li>
              <li className="flex items-center gap-2">• Top 50 Most Asked Concepts</li>
              <li className="flex items-center gap-2">• Time Management Strategy</li>
            </ul>
          </div>
          <div className="p-4 border-t border-border flex items-center justify-between bg-muted/30">
            <span className="font-medium text-success">Purchased</span>
            <button className="flex items-center gap-2 bg-muted text-foreground px-4 py-1.5 rounded-sm text-sm font-medium border border-border hover:bg-muted/80">
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        </div>

        {/* Sheet Card */}
        <div className="border border-border bg-card rounded-sm flex flex-col">
          <div className="p-6 flex-1 space-y-4">
            <div className="w-10 h-10 bg-primary/10 rounded-sm flex items-center justify-center">
              <FileText className="text-primary w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Goldman Sachs</h3>
              <p className="text-xs text-muted-foreground mt-1">Math & CS Analyst Roles</p>
            </div>
            <ul className="text-sm space-y-2 text-foreground/80">
              <li className="flex items-center gap-2">• Math & Probability Section Guide</li>
              <li className="flex items-center gap-2">• Coding Section Strategies</li>
              <li className="flex items-center gap-2">• Historical Cutoff Estimations</li>
            </ul>
          </div>
          <div className="p-4 border-t border-border flex items-center justify-between bg-muted/30">
            <span className="font-medium">1 Credit</span>
            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 rounded-sm text-sm font-medium hover:bg-primary/90">
              <Lock className="w-4 h-4" /> Unlock
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
