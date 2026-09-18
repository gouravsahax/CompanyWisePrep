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
    <div className="min-h-[calc(100vh-3.5rem)] w-full flex page-fade-in bg-transparent">
      
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col hidden lg:flex shrink-0 p-4 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto bg-black z-10 relative">
        <h3 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider px-3">Bookmarks</h3>
        <div className="flex flex-col gap-1">
          {mySavedCompanies.length === 0 ? (
            <div className="px-3 py-2 text-xs text-muted-foreground">No bookmarks saved.</div>
          ) : (
            mySavedCompanies.map(company => (
              <Link key={company.id} href={`/company/${company.slug}`} className="flex items-center gap-3 px-3 py-2 rounded-sm bg-white/5 text-foreground font-medium text-sm transition-colors hover:bg-white/10">
                {company.logo && <Image src={company.logo} alt={company.name} width={16} height={16} className="rounded-sm object-contain bg-white" />}
                {company.name}
              </Link>
            ))
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-8 bg-black z-10 relative">

        
        {/* HTML/CSS Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Banner 1 - Green */}
          <div className="relative aspect-[2/1] md:aspect-video rounded-sm overflow-hidden bg-emerald-950/30 border border-emerald-500/10 p-5 flex flex-col justify-center group hover:bg-emerald-900/40 hover:border-emerald-500/50 transition-all duration-300">
            {/* Background Glow */}
            <div className="absolute -inset-24 bg-emerald-500/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 rounded-full" />
            <div className="relative z-10">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-emerald-400 transition-colors">
                Choose Your<br/>Target Role
              </h2>
              <p className="text-xs md:text-sm text-emerald-100/60">
                Tell us where you're applying.
              </p>
            </div>
            {/* Decorative Element */}
            <div className="absolute right-[-10%] bottom-[-10%] w-32 h-32 border border-emerald-500/20 rounded-full flex items-center justify-center opacity-30 group-hover:opacity-60 group-hover:scale-110 group-hover:border-emerald-400/30 transition-all duration-500">
              <div className="w-24 h-24 border border-emerald-500/20 rounded-full group-hover:border-emerald-400/40" />
            </div>
          </div>

          {/* Banner 2 - Blue */}
          <div className="relative aspect-[2/1] md:aspect-video rounded-sm overflow-hidden bg-blue-950/30 border border-blue-500/10 p-5 flex flex-col justify-center group hover:bg-blue-900/40 hover:border-blue-500/50 transition-all duration-300">
            <div className="absolute -inset-24 bg-blue-500/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 rounded-full" />
            <div className="relative z-10">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-blue-400 transition-colors">
                Take the OA.
              </h2>
              <p className="text-xs md:text-sm text-blue-100/60">
                Practice the assessment built for your target role.
              </p>
            </div>
          </div>

          {/* Banner 3 - Yellow */}
          <div className="relative aspect-[2/1] md:aspect-video rounded-sm overflow-hidden bg-yellow-950/30 border border-yellow-500/10 p-5 flex flex-col justify-center group hover:bg-yellow-900/40 hover:border-yellow-500/50 transition-all duration-300">
            <div className="absolute -inset-24 bg-yellow-500/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 rounded-full" />
            <div className="relative z-10">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-yellow-400 transition-colors">
                Know what<br/>to fix.
              </h2>
              <p className="text-xs md:text-sm text-yellow-100/60">
                Understand your mistakes.<br/>Improve faster.
              </p>
            </div>
            {/* Decorative Score Ring */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-yellow-500/20 flex items-center justify-center group-hover:border-yellow-400 transition-colors duration-300">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="175" strokeDashoffset="45" className="text-yellow-500/50 group-hover:text-yellow-400 group-hover:opacity-100 transition-opacity duration-300" />
              </svg>
              <div className="text-xs font-bold text-white group-hover:text-yellow-400 transition-colors">72<span className="text-[8px] text-white/50">/100</span></div>
            </div>
          </div>

        </div>

        {/* List Header */}
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400 z-10 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to page 1 on search
              }}
              className="w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-sm py-2 pl-9 pr-14 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-black/60 transition-colors relative z-0"
            />
            <div className="absolute right-3 top-2.5 flex items-center z-10 pointer-events-none">
              <span className="text-xs text-gray-500 font-medium">CtrlK</span>
            </div>
          </div>
        </div>

        {/* Companies List */}
        <div className="border border-white/10 bg-black/40 backdrop-blur-md rounded-sm text-sm overflow-hidden">
          <div className="grid grid-cols-[1fr_6rem_10rem_6rem] gap-4 p-3 border-b border-white/10 text-gray-400 font-medium">
            <div className="uppercase tracking-wider text-xs">Company</div>
            <div className="text-center uppercase tracking-wider text-xs">Roles</div>
            <div className="text-center uppercase tracking-wider text-xs">Difficulty</div>
            <div className="text-center uppercase tracking-wider text-xs">Bookmark</div>
          </div>
          
          <div className="divide-y divide-white/5">
            {paginatedCompanies.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No companies found.</div>
            ) : (
              paginatedCompanies.map(company => {
                const isSaved = myCompanies.includes(company.id);
                return (
                  <Link key={company.id} href={`/company/${company.slug}`} className="grid grid-cols-[1fr_6rem_10rem_6rem] gap-4 p-3 hover:bg-white/5 transition-colors items-center group">
                    <div className="font-medium flex items-center gap-3 text-white">
                      <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center p-0.5 border border-white/20">
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
                        className={`p-1.5 rounded-sm transition-colors ${isSaved ? 'text-yellow-500 hover:bg-yellow-500/20' : 'text-gray-500 hover:bg-white/10'} ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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
            <div className="p-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 bg-white/5">
              <div>
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredCompanies.length)} of {filteredCompanies.length} companies
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded-sm border border-white/10 bg-black/40 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-medium text-white">Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-sm border border-white/10 bg-black/40 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Right Sidebar */}
      <aside className="w-72 hidden xl:flex flex-col p-6 space-y-8 bg-black border-l border-white/10 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto z-10 relative">

        {/* Top News */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm uppercase tracking-wider text-gray-300">Top News</span>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="#" className="group flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
              <div>
                <p className="text-xs font-medium group-hover:text-primary transition-colors line-clamp-2">Amazon SDE and Data Engineer roles and OA questions added.</p>
              </div>
            </Link>
            <Link href="#" className="group flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
              <div>
                <p className="text-xs font-medium group-hover:text-primary transition-colors line-clamp-2">Stripe Software Engineer Intern roles and OA questions added.</p>
              </div>
            </Link>
            <Link href="#" className="group flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
              <div>
                <p className="text-xs font-medium group-hover:text-primary transition-colors line-clamp-2">Salesforce Software Engineer Intern roles and OA questions added.</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Trending Companies (Top 10) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm uppercase tracking-wider text-gray-300">Trending</span>
          </div>
          <div className="flex flex-col gap-1">
            {companies.slice(0, 10).map((company, index) => (
              <Link key={company.id} href={`/company/${company.slug}`} className="flex items-center justify-between px-2 py-2.5 rounded-sm hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500 w-4 text-center">{index + 1}</span>
                  <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center p-0.5 border border-white/20">
                    {company.logo && <Image src={company.logo} alt={company.name} width={14} height={14} className="object-contain" />}
                  </div>
                  <span className="text-sm font-medium">{company.name}</span>
                </div>
                <span className="text-xs font-medium text-warning bg-warning/10 px-2 py-0.5 rounded-sm">3</span>
              </Link>
            ))}
          </div>
        </div>

      </aside>

    </div>
  );
}
