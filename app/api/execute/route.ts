import { NextResponse } from 'next/server';
import { executeCode } from '@/lib/executionEngine';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { code, language, questionId, type, timeTaken } = await req.json();

    if (!code || !language || !questionId) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    // Fetch the question to get the test cases
    const question = await prisma.dSAQuestion.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return NextResponse.json({ success: false, error: 'Question not found' }, { status: 404 });
    }

    // Use runTestCases or submitTestCases based on type
    const testCasesField = type === 'submit' ? question.submitTestCases : question.runTestCases;
    let testCases: any[] = [];
    
    // Parse if it's stored as string or just use it if it's already an array
    if (typeof testCasesField === 'string') {
      testCases = JSON.parse(testCasesField);
    } else {
      testCases = testCasesField as any[];
    }

    if (!testCases || testCases.length === 0) {
      return NextResponse.json({ success: false, error: 'No test cases found' }, { status: 400 });
    }

    const result = await executeCode(code, language, testCases);
    
    // If it's a submit action, save the user's latest solution in the standalone table
    if (type === 'submit') {
      const session = await getServerSession(authOptions);
      if (session && session.user && session.user.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email }
        });
        
        if (user) {
          let passedCount = 0;
          if (result.success && result.results && Array.isArray(result.results)) {
            passedCount = result.results.filter((r: any, i: number) => {
              return r.success && testCases[i] && JSON.stringify(r.result) === JSON.stringify(testCases[i].execOutput);
            }).length;
          }
          const totalCount = testCases.length;

          const existingSolution = await prisma.userDSASolution.findUnique({
            where: {
              userId_questionId: {
                userId: user.id,
                questionId: questionId
              }
            }
          });

          let shouldUpdate = false;
          if (!existingSolution) {
            shouldUpdate = true;
          } else {
            if (passedCount > existingSolution.testCasesPassed) {
              shouldUpdate = true;
            } else if (passedCount === existingSolution.testCasesPassed) {
              if (timeTaken !== undefined && existingSolution.timeTaken !== null && timeTaken < existingSolution.timeTaken) {
                shouldUpdate = true;
              } else if (existingSolution.timeTaken === null && timeTaken !== undefined) {
                shouldUpdate = true;
              }
            }
          }

          if (shouldUpdate) {
            await prisma.userDSASolution.upsert({
              where: {
                userId_questionId: {
                  userId: user.id,
                  questionId: questionId
                }
              },
              update: {
                language,
                code,
                testCasesPassed: passedCount,
                totalTestCases: totalCount,
                timeTaken: timeTaken ?? null
              },
              create: {
                userId: user.id,
                questionId: questionId,
                language,
                code,
                testCasesPassed: passedCount,
                totalTestCases: totalCount,
                timeTaken: timeTaken ?? null
              }
            });
          }
        }
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Execution API error:', error);
    // Only return generic messages to avoid leaking Prisma raw errors
    return NextResponse.json({ success: false, error: 'An unexpected execution error occurred. Please try again later.' }, { status: 500 });
  }
}
