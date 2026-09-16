"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Clock, FileText, Lock, ChevronRight, CheckCircle2, Loader2, Play } from "lucide-react";
import { Company, Role } from "@prisma/client";

import { getMockOAs } from "@/lib/mockOAs";
import { unlockAssessment } from "@/app/actions/assessment";
import { toast } from "react-hot-toast";

export default function CompanyAssessmentClient({
  company,
  roles,
  initialUnlocked = []
}: {
  company: Company;
  roles: Role[];
  initialUnlocked?: { assessmentId: string, status: string }[];
}) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0] || null);
  const [isPending, startTransition] = useTransition();
  const [unlockingId, setUnlockingId] = useState<string | null>(null);
  const router = useRouter();
  const { update } = useSession();

  // Generate demo OAs for the selected role based on its oaCount
  const demoOAs = getMockOAs(company, selectedRole);

  const handleUnlock = async (oaId: string, cost: number) => {
    setUnlockingId(oaId);
    startTransition(async () => {
      const result = await unlockAssessment(oaId, cost, company.slug);
      if (result.success) {
        // Refresh session to update credits in navbar
        await update();
      } else {
        if (result.insufficientCredits) {
          toast.error("Insufficient credits! Redirecting to pricing page...");
          router.push("/pricing");
        } else {
          toast.error(result.error || "Failed to unlock assessment");
        }
      }
      setUnlockingId(null);
    });
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] w-full flex flex-col overflow-hidden bg-background page-fade-in font-sans">
      
      {/* Sleek Top Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-md shrink-0 px-6 py-2.5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors border border-border/50 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
          </Link>
          <div className="flex items-center gap-3">
            {company.logo && (
              <div className="w-8 h-8 bg-white rounded-sm shadow-sm border border-border/50 flex items-center justify-center p-1">
                <Image src={company.logo} alt={company.name} width={24} height={24} className="object-contain" />
              </div>
            )}
            <div className="flex flex-col justify-center">
              <h1 className="text-base font-semibold tracking-tight leading-tight">{company.name} Assessments</h1>
              <p className="text-[11px] text-muted-foreground font-light leading-tight mt-0.5">Mock OAs and Premium Prep Materials</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Modern Sidebar */}
        <aside className="w-80 border-r border-border/40 bg-card/30 shrink-0 overflow-y-auto flex flex-col">
          <div className="p-6 border-b border-border/40">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">Available Roles</h2>
          </div>
          <div className="flex-1 py-4 px-3 space-y-4">
            {roles.length === 0 ? (
              <div className="p-6 text-center text-sm font-light text-muted-foreground">No roles available.</div>
            ) : (
              roles.map((role) => {
                const isActive = selectedRole?.id === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`w-full text-left px-4 py-4 rounded-sm text-sm transition-all duration-200 flex items-center justify-between gap-4 group cursor-pointer ${
                      isActive 
                        ? "bg-primary/10 border border-primary/20 shadow-sm" 
                        : "hover:bg-muted/50 border border-transparent"
                    }`}
                  >
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <span className={`truncate leading-relaxed ${isActive ? "font-medium text-primary" : "font-light text-foreground/80 group-hover:text-foreground"}`}>
                        {role.name}
                      </span>
                      <span className={`text-[10px] uppercase tracking-wider font-medium w-fit px-2 py-0.5 rounded-full transition-colors ${
                        isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground border border-border/50"
                      }`}>
                        {role.oaCount} {role.oaCount === 1 ? 'OA' : 'OAs'}
                      </span>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "text-primary translate-x-1" : "text-muted-foreground/30 opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100"}`} />
                  </button>
                )
              })
            )}
          </div>
        </aside>

        {/* Spacious Main Content */}
        <main className="flex-1 overflow-y-auto p-10 bg-background/50">
          {!selectedRole ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-muted/50 rounded-sm flex items-center justify-center mx-auto border border-border/50 shadow-sm">
                  <FileText className="w-8 h-8 text-muted-foreground/50 stroke-[1.5]" />
                </div>
                <h2 className="text-2xl font-light tracking-tight">Select a Role</h2>
                <p className="text-muted-foreground font-light max-w-sm mx-auto">
                  Choose a role from the sidebar to view available mock Online Assessments.
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-5xl space-y-10 page-fade-in">
              <div className="space-y-2">
                <h2 className="text-3xl font-light tracking-tight">{selectedRole.name}</h2>
                <p className="text-muted-foreground font-light text-lg">Select a mock assessment to begin your practice.</p>
              </div>

              {demoOAs.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-border/60 rounded-sm bg-card/30">
                  <p className="text-muted-foreground font-light text-lg">No mock assessments available for this role yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {demoOAs.map((oa) => {
                    const unlockedData = initialUnlocked.find(u => u.assessmentId === oa.id);
                    const isUnlocked = !!unlockedData;
                    const status = unlockedData?.status || "UNLOCKED";
                    const isUnlocking = isPending && unlockingId === oa.id;

                    return (
                      <div key={oa.id} className="relative overflow-hidden rounded-sm border border-border/50 bg-card/40 backdrop-blur-xl p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 group">
                        
                        {/* Subtle Glow Effect */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-6">
                            <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                              <FileText className="w-6 h-6 stroke-[1.5]" />
                            </div>
                            <span className={`text-xs font-medium px-3 py-1 rounded-full border ${
                              oa.difficulty === 'Hard' ? 'bg-danger/10 text-danger border-danger/20' : 
                              oa.difficulty === 'Medium' ? 'bg-warning/10 text-warning border-warning/20' : 
                              'bg-success/10 text-success border-success/20'
                            }`}>
                              {oa.difficulty}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-medium tracking-tight mb-2 group-hover:text-primary transition-colors">{oa.title}</h3>
                          
                          <div className="flex items-center gap-6 text-sm text-muted-foreground/80 font-light mb-8">
                            <span className="flex items-center gap-2"><Clock className="w-4 h-4 stroke-[1.5]" /> {oa.duration}</span>
                            <span className="w-1 h-1 rounded-full bg-border"></span>
                            <span className="flex items-center gap-2">{oa.questions} Questions</span>
                          </div>
                          
                          {isUnlocked ? (
                            status === "COMPLETED" ? (
                              <Link href={`/company/${company.slug}/${oa.id}`} className="block w-full">
                                <button className="w-full py-3 rounded-sm bg-secondary text-secondary-foreground font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:bg-secondary/90 border border-border/50">
                                  <CheckCircle2 className="w-4 h-4 stroke-[1.5]" /> 
                                  <span>Review Assessment</span>
                                </button>
                              </Link>
                            ) : (
                              <Link href={`/company/${company.slug}/${oa.id}`} className="block w-full">
                                <button className="w-full py-3 rounded-sm bg-success text-success-foreground font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:bg-success/90">
                                  <Play className="w-4 h-4 stroke-[1.5] fill-current" /> 
                                  <span>Start Assessment</span>
                                </button>
                              </Link>
                            )
                          ) : (
                            <button 
                              disabled={isUnlocking}
                              onClick={() => handleUnlock(oa.id, oa.credits)}
                              className="w-full py-3 rounded-sm bg-muted/50 group-hover:bg-primary group-hover:text-primary-foreground text-foreground text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 border border-border/50 group-hover:border-primary shadow-sm cursor-pointer disabled:opacity-50"
                            >
                              {isUnlocking ? (
                                <Loader2 className="w-4 h-4 stroke-[1.5] animate-spin" />
                              ) : (
                                <Lock className="w-4 h-4 stroke-[1.5] group-hover:text-primary-foreground/80" /> 
                              )}
                              <span>
                                {isUnlocking ? "Unlocking..." : `Unlock Assessment (${oa.credits} credit${oa.credits > 1 ? 's' : ''})`}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Right Sidebar - Assessment Pattern */}
        {selectedRole && (
          <aside className="w-80 border-l border-border/40 bg-card/30 shrink-0 overflow-y-auto hidden xl:flex flex-col">
            <div className="p-6 border-b border-border/40">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">Assessment Pattern</h2>
            </div>
            <div className="flex-1 p-6">
              {selectedRole.pattern ? (
                <div className="whitespace-pre-wrap text-sm font-light leading-relaxed text-foreground/90">
                  {selectedRole.pattern}
                </div>
              ) : (
                <div className="text-center space-y-3 mt-10">
                  <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="w-5 h-5 text-muted-foreground/50 stroke-[1.5]" />
                  </div>
                  <p className="text-sm font-light text-muted-foreground">Pattern information is not available for this role yet.</p>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
