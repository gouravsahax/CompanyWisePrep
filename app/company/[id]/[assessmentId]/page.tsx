import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import AssessmentWorkspace from "@/components/AssessmentWorkspace";
import UIBuildWorkspace from "@/components/UIBuildWorkspace";

export default async function AssessmentTakingPage({ 
  params 
}: { 
  params: Promise<{ id: string, assessmentId: string }> 
}) {
  const { id, assessmentId } = await params;
  
  // Try finding by ID first, then fallback to slug
  const company = await prisma.company.findUnique({
    where: { id },
    include: { roles: true }
  });

  const companyBySlug = !company ? await prisma.company.findUnique({
    where: { slug: id },
    include: { roles: true }
  }) : null;

  const actualCompany = company || companyBySlug;

  if (!actualCompany) {
    notFound();
  }

  // Auth & Unlock Check
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect(`/company/${actualCompany.slug}`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { unlockedAssessments: true }
  });

  if (!user) {
    redirect(`/company/${actualCompany.slug}`);
  }

  const activeAssessment = user.unlockedAssessments.find(ua => ua.assessmentId === assessmentId);
  if (!activeAssessment) {
    redirect(`/company/${actualCompany.slug}`);
  }

  const roleId = assessmentId.split('-oa-')[0];
  const role = actualCompany.roles.find(r => r.id === roleId);

  // If this is a DSA assessment, fetch questions
  let dsaQuestions: any[] = [];
  if (assessmentId.includes('dsa') && role) {
    let oaSetNo = 1;
    if (assessmentId.includes('dsa-2')) oaSetNo = 2;
    
    dsaQuestions = await prisma.dSAQuestion.findMany({
      where: {
        roleId: role.id,
        companyId: actualCompany.id,
        oaSetNo
      }
    });
  }

  // If this is a UI Build assessment, fetch UI questions
  let uiQuestions: any[] = [];
  if (assessmentId.includes('ui') && role) {
    let oaSetNo = 1; 
    if (assessmentId.includes('-oa-ui-2')) {
      oaSetNo = 2;
    }
    uiQuestions = await prisma.uIBuildQuestion.findMany({
      where: {
        roleId: role.id,
        companyId: actualCompany.id,
        oaSetNo
      }
    });
  }

  const isCompleted = activeAssessment.status === 'COMPLETED';

  return (
    <div className="w-full h-screen flex flex-col bg-background overflow-hidden font-sans page-fade-in">
      {/* Main Workspace with Header and Timer */}
      {assessmentId.includes('ui') ? (
        <UIBuildWorkspace 
          uiQuestions={uiQuestions} 
          company={actualCompany}
          role={role || null}
          assessmentId={assessmentId}
          isCompleted={isCompleted}
          pastSubmissions={activeAssessment.submissions}
          testResults={activeAssessment.testResults}
        />
      ) : (
        <AssessmentWorkspace 
          dsaQuestions={dsaQuestions} 
          company={actualCompany}
          role={role || null}
          assessmentId={assessmentId}
          isCompleted={isCompleted}
          pastSubmissions={activeAssessment.submissions}
          testResults={activeAssessment.testResults}
          defaultLanguage={user.defaultLanguage || "javascript"}
        />
      )}
    </div>
  );
}
