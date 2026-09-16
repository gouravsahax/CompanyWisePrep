import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BrainCircuit, CheckCircle2, Target, Zap, Clock, Code2 } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function AssessmentAnalysisPage({ 
  params 
}: { 
  params: Promise<{ id: string, assessmentId: string }> 
}) {
  const { id, assessmentId } = await params;
  
  const company = await prisma.company.findUnique({
    where: { id },
    include: { roles: true }
  });
  const companyBySlug = !company ? await prisma.company.findUnique({
    where: { slug: id },
    include: { roles: true }
  }) : null;
  const actualCompany = company || companyBySlug;

  if (!actualCompany) notFound();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect(`/company/${actualCompany.slug}`);

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { 
      unlockedAssessments: true,
      analysis: true,
      dsaSolutions: {
        include: { question: true }
      }
    }
  });

  if (!user) redirect(`/company/${actualCompany.slug}`);

  const activeAssessment = user.unlockedAssessments.find(ua => ua.assessmentId === assessmentId);
  if (!activeAssessment || activeAssessment.status !== 'COMPLETED') {
    redirect(`/company/${actualCompany.slug}`);
  }

  const roleId = assessmentId.split('-oa-')[0];
  const role = actualCompany.roles.find(r => r.id === roleId);

  // Extract the assessment-specific AI feedback
  const assessmentAnalysis = activeAssessment.assessmentAnalysis as any || {};
  const globalAnalysis = user.analysis;

  // Filter solutions to just the ones in this assessment's role/set
  let oaSetNo = 1;
  if (assessmentId.includes('dsa-2')) oaSetNo = 2;
  
  const assessmentQuestions = await prisma.dSAQuestion.findMany({
    where: { roleId: role?.id, companyId: actualCompany.id, oaSetNo }
  });

  const questionIds = assessmentQuestions.map(q => q.id);
  const solutions = user.dsaSolutions.filter(s => questionIds.includes(s.questionId));

  return (
    <div className="min-h-screen bg-background font-sans page-fade-in text-foreground pb-20">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-md px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            href={`/company/${actualCompany.slug}`}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors border border-border/50 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5 stroke-[1.5]" />
          </Link>
          <div>
            <h1 className="text-base font-medium tracking-tight text-foreground flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-primary" />
              AI Performance Analysis
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              {actualCompany.name} • {role?.name} Assessment
            </p>
          </div>
        </div>
        <Link
          href={`/company/${actualCompany.slug}/${assessmentId}`}
          className="text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-sm transition-colors"
        >
          Review Code
        </Link>
      </div>

      <main className="max-w-6xl mx-auto px-6 mt-8 space-y-8">
        
        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border/50 rounded-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Completion</p>
              <p className="text-2xl font-semibold tracking-tight">{solutions.filter(s => s.testCasesPassed === s.totalTestCases && s.totalTestCases > 0).length} <span className="text-lg text-muted-foreground font-normal">/ {assessmentQuestions.length} Optimal</span></p>
            </div>
          </div>
          
          <div className="bg-card border border-border/50 rounded-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Avg Time</p>
              <p className="text-2xl font-semibold tracking-tight">
                {solutions.length > 0 ? Math.round(solutions.reduce((acc, s) => acc + (s.timeTaken || 0), 0) / solutions.length / 60) : 0} <span className="text-lg text-muted-foreground font-normal">mins</span>
              </p>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Accuracy</p>
              <p className="text-2xl font-semibold tracking-tight">
                {solutions.length > 0 ? Math.round((solutions.reduce((acc, s) => acc + s.testCasesPassed, 0) / Math.max(1, solutions.reduce((acc, s) => acc + s.totalTestCases, 0))) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assessment AI Feedback */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-primary/5 border border-primary/20 rounded-sm p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Zap className="w-32 h-32 text-primary" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight mb-4 flex items-center gap-2">
                <BrainCircuit className="w-6 h-6 text-primary" />
                Assessment AI Insights
              </h2>
              <div className="prose prose-invert prose-p:leading-relaxed text-muted-foreground text-[15px]">
                <p>{assessmentAnalysis.generalFeedback || "No AI feedback generated for this assessment. Ensure the GROQ API key is configured."}</p>
              </div>
            </div>

            {/* Questions Breakdown */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight px-1">Problem Breakdown</h2>
              <div className="space-y-4">
                {assessmentQuestions.map((q, idx) => {
                  const sol = solutions.find(s => s.questionId === q.id);
                  const isOptimal = sol && sol.testCasesPassed === sol.totalTestCases && sol.totalTestCases > 0;
                  return (
                    <div key={q.id} className="bg-card border border-border/50 rounded-sm p-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center hover:border-border transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-muted-foreground text-sm">{idx + 1}.</span>
                          <h3 className="font-semibold text-lg">{q.title}</h3>
                          {isOptimal && <span className="bg-success/20 text-success text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">Optimal</span>}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                          <span>{q.topic}</span>
                          <span>•</span>
                          <span>{q.timeComplexity}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex flex-col items-end">
                          <span className="text-muted-foreground uppercase text-[10px] tracking-wider mb-1">Test Cases</span>
                          <span className={`font-mono font-medium ${isOptimal ? 'text-success' : (sol && sol.testCasesPassed > 0 ? 'text-orange-500' : 'text-muted-foreground')}`}>
                            {sol ? sol.testCasesPassed : 0} / {sol ? sol.totalTestCases : q.submitTestCases?.length || 0}
                          </span>
                        </div>
                        <div className="w-px h-8 bg-border/50 hidden sm:block"></div>
                        <div className="flex flex-col items-end">
                          <span className="text-muted-foreground uppercase text-[10px] tracking-wider mb-1">Time</span>
                          <span className="font-mono font-medium">
                            {sol?.timeTaken ? `${Math.floor(sol.timeTaken / 60)}m ${sol.timeTaken % 60}s` : '--'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Global Profile Sidebar */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight px-1">Global Skill Profile</h2>
            <div className="bg-card border border-border/50 rounded-sm overflow-hidden">
              
              {/* Strong Topics */}
              <div className="p-6 border-b border-border/50 bg-success/5">
                <h3 className="text-sm font-semibold text-success uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  Strong Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {((globalAnalysis?.strongTopics as string[]) || []).map(t => (
                    <span key={t} className="bg-success/20 text-success text-xs font-medium px-2.5 py-1 rounded-sm border border-success/20">
                      {t}
                    </span>
                  ))}
                  {!globalAnalysis?.strongTopics?.length && <span className="text-sm text-muted-foreground italic">None yet</span>}
                </div>
              </div>

              {/* Medium Topics */}
              <div className="p-6 border-b border-border/50 bg-orange-500/5">
                <h3 className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  Familiar Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {((globalAnalysis?.mediumTopics as string[]) || []).map(t => (
                    <span key={t} className="bg-orange-500/20 text-orange-500 text-xs font-medium px-2.5 py-1 rounded-sm border border-orange-500/20">
                      {t}
                    </span>
                  ))}
                  {!globalAnalysis?.mediumTopics?.length && <span className="text-sm text-muted-foreground italic">None yet</span>}
                </div>
              </div>

              {/* Weak Topics */}
              <div className="p-6 bg-red-500/5">
                <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  Needs Practice
                </h3>
                <div className="flex flex-wrap gap-2">
                  {((globalAnalysis?.weakTopics as string[]) || []).map(t => (
                    <span key={t} className="bg-red-500/20 text-red-500 text-xs font-medium px-2.5 py-1 rounded-sm border border-red-500/20">
                      {t}
                    </span>
                  ))}
                  {!globalAnalysis?.weakTopics?.length && <span className="text-sm text-muted-foreground italic">None yet</span>}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
