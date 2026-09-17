import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CompanyAssessmentClient from "@/components/CompanyAssessmentClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const company = await prisma.company.findUnique({ where: { id } }) || 
                  await prisma.company.findUnique({ where: { slug: id } });

  if (!company) {
    return {
      title: "Company Not Found",
    };
  }

  return {
    title: `${company.name} Mock Online Assessments (OA)`,
    description: `Practice real, up-to-date mock online assessments for ${company.name}. Get AI feedback and prepare for your software engineering interview.`,
  };
}

export default async function CompanyAssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
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

  const session = await getServerSession(authOptions);
  let unlockedAssessments: { assessmentId: string, status: string }[] = [];
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { unlockedAssessments: true }
    });
    if (user) {
      unlockedAssessments = user.unlockedAssessments.map(ua => ({
        assessmentId: ua.assessmentId,
        status: ua.status
      }));
    }
  }

  return (
    <CompanyAssessmentClient 
      company={actualCompany} 
      roles={actualCompany.roles} 
      initialUnlocked={unlockedAssessments} 
    />
  );
}
