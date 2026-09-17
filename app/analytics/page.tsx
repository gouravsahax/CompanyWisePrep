import { BarChart, BrainCircuit } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Global AI analysis of your interview prep performance across all company assessments.",
};

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { 
      analysis: true,
      unlockedAssessments: {
        where: { status: "COMPLETED" },
        orderBy: { unlockedAt: "desc" }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  const globalAnalysis = user.analysis;
  const completedAssessments = user.unlockedAssessments;

  // Fetch roles for the completed assessments to display their names
  const roleIds = completedAssessments.map(a => a.assessmentId.split('-oa-')[0]);
  const roles = await prisma.role.findMany({
    where: { id: { in: roleIds } },
    include: { company: true }
  });

  const parseJsonArray = (val: any): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  const strongTopics = parseJsonArray(globalAnalysis?.strongTopics);
  const mediumTopics = parseJsonArray(globalAnalysis?.mediumTopics);
  const weakTopics = parseJsonArray(globalAnalysis?.weakTopics);

  return (
    <div className="min-h-screen bg-background font-sans page-fade-in text-foreground pb-20">
      <div className="max-w-4xl mx-auto px-6 mt-12 space-y-12">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Global AI Analysis</h1>
              <p className="text-muted-foreground text-sm font-light">Your overall skill profile across all assessments</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border/50 rounded-sm overflow-hidden shadow-sm">
              {/* Strong Topics */}
              <div className="p-8 border-b border-border/50 bg-success/5">
                <h3 className="text-sm font-semibold text-success uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  Strong Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {strongTopics.map((t: string) => (
                    <span key={t} className="bg-success/20 text-success text-xs font-medium px-3 py-1.5 rounded-sm border border-success/20">
                      {t}
                    </span>
                  ))}
                  {!strongTopics.length && <span className="text-sm text-muted-foreground italic">None yet. Keep practicing to build your strengths!</span>}
                </div>
              </div>

              {/* Medium Topics */}
              <div className="p-8 border-b border-border/50 bg-orange-500/5">
                <h3 className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  Familiar Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mediumTopics.map((t: string) => (
                    <span key={t} className="bg-orange-500/20 text-orange-500 text-xs font-medium px-3 py-1.5 rounded-sm border border-orange-500/20">
                      {t}
                    </span>
                  ))}
                  {!mediumTopics.length && <span className="text-sm text-muted-foreground italic">None yet. Expand your knowledge!</span>}
                </div>
              </div>

              {/* Weak Topics */}
              <div className="p-8 bg-red-500/5">
                <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  Needs Practice
                </h3>
                <div className="flex flex-wrap gap-2">
                  {weakTopics.map((t: string) => (
                    <span key={t} className="bg-red-500/20 text-red-500 text-xs font-medium px-3 py-1.5 rounded-sm border border-red-500/20">
                      {t}
                    </span>
                  ))}
                  {!weakTopics.length && <span className="text-sm text-muted-foreground italic">None yet. Perfect!</span>}
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border/50 rounded-sm p-8">
               <h3 className="text-base font-medium tracking-tight mb-3">Global AI Coach Feedback</h3>
               <p className="text-muted-foreground text-[15px] leading-relaxed">
                 {globalAnalysis?.generalFeedback || "Complete more assessments to generate comprehensive feedback from your AI Coach."}
               </p>
            </div>
          </div>
        </div>

        {/* Assessment-specific feedback */}
        {completedAssessments.length > 0 && (
          <div className="pt-8 border-t border-border/50">
            <h2 className="text-lg font-semibold tracking-tight mb-6">Recent Assessments Analysis</h2>
            <div className="space-y-6">
              {completedAssessments.map((assessment) => {
                const roleId = assessment.assessmentId.split('-oa-')[0];
                const role = roles.find(r => r.id === roleId);
                const assessmentAnalysis = (assessment.assessmentAnalysis as any) || {};

                return (
                  <div key={assessment.id} className="bg-card border border-border/50 rounded-sm p-8">
                    <div className="mb-4">
                      <h3 className="font-medium text-base">{role?.company?.name} • {role?.name} Assessment</h3>
                      <p className="text-xs text-muted-foreground mt-1">Completed on {new Date(assessment.unlockedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="prose prose-invert prose-p:leading-relaxed text-muted-foreground text-[15px]">
                      <p>{assessmentAnalysis.generalFeedback || "No specific AI feedback generated for this assessment."}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
