import Link from "next/link";
import { Search, Filter } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mock Online Assessments",
  description: "Browse and practice company-specific mock Online Assessments for top tech companies.",
};

export default function AssessmentsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto w-full space-y-8 page-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mock Online Assessments</h1>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search companies or roles..." 
            className="w-full bg-card border border-border rounded-sm py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <button className="flex items-center gap-2 border border-border bg-card px-4 py-2 rounded-sm text-sm hover:bg-muted">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="border border-border bg-card rounded-sm divide-y divide-border">
        {/* Assessment Row */}
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg">Google</h3>
              <span className="px-2 py-0.5 bg-muted text-xs font-medium rounded-sm">Software Engineer</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">90 mins • 2 Coding, 10 MCQs • Medium/Hard</p>
            <div className="flex gap-2">
              <span className="text-xs border border-border px-2 py-1 rounded-sm">Graphs</span>
              <span className="text-xs border border-border px-2 py-1 rounded-sm">Dynamic Programming</span>
            </div>
          </div>
          <Link href="/assessments/google-sde" className="bg-primary text-primary-foreground px-6 py-2 rounded-sm text-sm font-medium hover:bg-primary/90 text-center">
            Start Mock OA
          </Link>
        </div>

        {/* Assessment Row */}
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg">Amazon</h3>
              <span className="px-2 py-0.5 bg-muted text-xs font-medium rounded-sm">SDE I (2024 Pattern)</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">70 mins • 2 Coding • Medium</p>
            <div className="flex gap-2">
              <span className="text-xs border border-border px-2 py-1 rounded-sm">Arrays</span>
              <span className="text-xs border border-border px-2 py-1 rounded-sm">Heaps</span>
            </div>
          </div>
          <Link href="/assessments/amazon-sde" className="bg-primary text-primary-foreground px-6 py-2 rounded-sm text-sm font-medium hover:bg-primary/90 text-center">
            Start Mock OA
          </Link>
        </div>
        
        {/* Assessment Row */}
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg">Microsoft</h3>
              <span className="px-2 py-0.5 bg-muted text-xs font-medium rounded-sm">Software Engineer</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">120 mins • 3 Coding • Easy/Medium</p>
            <div className="flex gap-2">
              <span className="text-xs border border-border px-2 py-1 rounded-sm">Strings</span>
              <span className="text-xs border border-border px-2 py-1 rounded-sm">Trees</span>
            </div>
          </div>
          <Link href="/assessments/microsoft-sde" className="bg-primary text-primary-foreground px-6 py-2 rounded-sm text-sm font-medium hover:bg-primary/90 text-center">
            Start Mock OA
          </Link>
        </div>
      </div>
    </div>
  );
}
