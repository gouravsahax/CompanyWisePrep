import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const q = await prisma.dSAQuestion.findFirst({
    where: { title: "Valid Component Nesting" }
  });
  console.log("Q2 SUBMIT TEST CASES:");
  console.log(JSON.stringify(q?.submitTestCases, null, 2));
  return NextResponse.json({ success: true });
}
