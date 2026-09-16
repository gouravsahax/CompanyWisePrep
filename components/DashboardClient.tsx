"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toggleBookmark } from "@/app/actions/bookmark";
import { toast } from "react-hot-toast";

const ITEMS_PER_PAGE = 4;

type Company = {
  id: string;
  slug: string;
  name: string;
  logo: string | null;
  oas: number | null;
  prepSheets: string | null;
  difficulty: string | null;
  _count?: {
    roles: number;
  };
};

export default function DashboardClient({ 
  companies, 
  initialBookmarks 
}: { 
  companies: Company[];
  initialBookmarks: string[];
}) {
  const [myCompanies, setMyCompanies] = useState<string[]>(initialBookmarks);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleToggleBookmark = (companyId: string, e: React.MouseEvent) => {
    e.preventDefault(); 
    
    // Optimistic UI update
    setMyCompanies(prev => 
      prev.includes(companyId) ? prev.filter(id => id !== companyId) : [...prev, companyId]
    );

    startTransition(async () => {
      try {
        await toggleBookmark(companyId);
      } catch (err) {
        // Revert on error
        setMyCompanies(prev => 
          prev.includes(companyId) ? prev.filter(id => id !== companyId) : [...prev, companyId]
        );
        toast.error("Failed to save bookmark. Please make sure you are logged in.");
      }
    });
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE) || 1;
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const mySavedCompanies = companies.filter(c => myCompanies.includes(c.id));

  return (
    <div className="h-[calc(100vh-3.5rem)] w-full flex overflow-hidden page-fade-in bg-background">
      
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col hidden lg:flex shrink-0 p-4 overflow-y-auto">
        <h3 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider px-3">Bookmarks</h3>
        <div className="flex flex-col gap-1">
          {mySavedCompanies.length === 0 ? (
            <div className="px-3 py-2 text-xs text-muted-foreground">No bookmarks saved.</div>
          ) : (
            mySavedCompanies.map(company => (
              <Link key={company.id} href={`/company/${company.slug}`} className="flex items-center gap-3 px-3 py-2 rounded-sm bg-muted text-foreground font-medium text-sm transition-colors hover:bg-muted/80">
                {company.logo && <Image src={company.logo} alt={company.name} width={16} height={16} className="rounded-sm object-contain bg-white" />}
                {company.name}
              </Link>
            ))
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative aspect-video rounded-sm overflow-hidden bg-muted border border-border">
            <Image src="/banners/b1.png" alt="Promo 1" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          </div>
          <div className="relative aspect-video rounded-sm overflow-hidden bg-muted border border-border">
            <Image src="/banners/b2.png" alt="Promo 2" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          </div>
          <div className="relative aspect-video rounded-sm overflow-hidden bg-muted border border-border">
            <Image src="/banners/b3.png" alt="Promo 3" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          </div>
        </div>

        {/* List Header */}
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search for a company..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to page 1 on search
              }}
              className="w-full bg-card border border-border rounded-sm py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Companies List */}
        <div className="border border-border bg-card rounded-sm text-sm">
          <div className="grid grid-cols-[1fr_6rem_10rem_6rem] gap-4 p-3 border-b border-border text-muted-foreground font-medium">
            <div>Company</div>
            <div className="text-center">Roles</div>
            <div className="text-center">Avg Difficulty</div>
            <div className="text-center">Bookmark</div>
          </div>
          
          <div className="divide-y divide-border">
            {paginatedCompanies.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No companies found.</div>
            ) : (
              paginatedCompanies.map(company => {
                const isSaved = myCompanies.includes(company.id);
                return (
                  <Link key={company.id} href={`/company/${company.slug}`} className="grid grid-cols-[1fr_6rem_10rem_6rem] gap-4 p-3 hover:bg-muted/30 transition-colors items-center group">
                    <div className="font-medium flex items-center gap-3">
                      <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center p-0.5 border border-border">
                        {company.logo && <Image src={company.logo} alt={company.name} width={20} height={20} className="object-contain" />}
                      </div>
                      {company.name}
                    </div>
                    <div className="text-center text-muted-foreground">{company._count?.roles || 0}</div>
                    <div className={`text-center ${company.difficulty === 'Hard' ? 'text-danger' : company.difficulty === 'Medium' ? 'text-warning' : 'text-success'}`}>
                      {company.difficulty}
                    </div>
                    <div className="flex justify-center">
                      <button 
                        onClick={(e) => handleToggleBookmark(company.id, e)}
                        disabled={isPending}
                        className={`p-1.5 rounded-sm transition-colors ${isSaved ? 'text-warning hover:bg-warning/20' : 'text-muted-foreground hover:bg-muted/50'} ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        title={isSaved ? "Remove from Bookmarks" : "Add to Bookmarks"}
                      >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /> : (isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />)}
                      </button>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground bg-muted/20">
              <div>
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredCompanies.length)} of {filteredCompanies.length} companies
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded-sm border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-medium">Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-sm border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Right Sidebar */}
      <aside className="w-72 hidden xl:flex flex-col p-6 space-y-8 bg-card shrink-0 overflow-y-auto">

        {/* Top News */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm">Top News</span>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="#" className="group flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
              <div>
                <p className="text-xs font-medium group-hover:text-primary transition-colors line-clamp-2">Amazon SDE and Data Engineer roles and OA questions added.</p>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">1 hour ago</span>
              </div>
            </Link>
            <Link href="#" className="group flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
              <div>
                <p className="text-xs font-medium group-hover:text-primary transition-colors line-clamp-2">HSBC SDE Intern OA questions added for 2025 cycle.</p>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">2 hours ago</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Trending Companies (Top 10) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm">Trending Companies</span>
          </div>
          <div className="flex flex-col gap-1">
            {companies.slice(0, 10).map((company, index) => (
              <Link key={company.id} href={`/company/${company.slug}`} className="flex items-center justify-between px-2 py-2.5 rounded-sm hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted-foreground w-4 text-center">{index + 1}</span>
                  <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center p-0.5">
                    {company.logo && <Image src={company.logo} alt={company.name} width={14} height={14} className="object-contain" />}
                  </div>
                  <span className="text-sm font-medium">{company.name}</span>
                </div>
                <span className="text-xs font-medium text-warning bg-warning/10 px-2 py-0.5 rounded-sm">{2300 - (index * 400)}</span>
              </Link>
            ))}
          </div>
        </div>

      </aside>

    </div>
  );
}
