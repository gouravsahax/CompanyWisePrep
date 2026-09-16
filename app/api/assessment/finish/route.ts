import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { executeCode } from '@/lib/executionEngine';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { assessmentId, submissions, language } = body;

    if (!assessmentId) {
      return NextResponse.json({ success: false, error: 'Missing assessmentId' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { analysis: true }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Identify which questions belong to this assessment to evaluate them
    const roleId = assessmentId.split('-oa-')[0];
    let oaSetNo = 1;
    if (assessmentId.includes('dsa-2')) oaSetNo = 2;
    
    const questions = await prisma.dSAQuestion.findMany({
      where: { roleId, oaSetNo }
    });

    const userSolutions = await prisma.userDSASolution.findMany({
      where: {
        userId: user.id,
        questionId: { in: questions.map(q => q.id) }
      }
    });

    const testResults: Record<string, any> = {};

    // Evaluate submissions for each question
    if (submissions && language) {
      for (const q of questions) {
        const code = submissions[q.id]?.[language];
        if (code && code.trim().length > 0) {
          let testCases = q.submitTestCases as any[];
          if (typeof testCases === 'string') testCases = JSON.parse(testCases);
          
          if (testCases && testCases.length > 0) {
            const execResult = await executeCode(code, language, testCases);
            testResults[q.id] = {
              language,
              execution: execResult
            };
          }
        }
      }
    }

    // 1. Prepare Data for AI Analysis based on testResults we just computed
    const promptData = {
      previousAnalysis: user.analysis ? {
        strongTopics: user.analysis.strongTopics,
        mediumTopics: user.analysis.mediumTopics,
        weakTopics: user.analysis.weakTopics,
      } : null,
      currentAssessment: questions.map(q => {
        const execData = testResults[q.id]?.execution;
        let testCasesPassed = 0;
        
        let parsedTestCases: any[] = [];
        if (q.submitTestCases) {
          parsedTestCases = typeof q.submitTestCases === 'string' ? JSON.parse(q.submitTestCases) : q.submitTestCases as any[];
        }
        const totalTestCases = parsedTestCases.length;
        
        if (execData && execData.success && execData.results) {
          execData.results.forEach((r: any, idx: number) => {
            if (r.success && JSON.stringify(r.result) === JSON.stringify(parsedTestCases[idx]?.execOutput)) {
              testCasesPassed++;
            }
          });
        }
        
        const solution = userSolutions.find(s => s.questionId === q.id);
        const timeTakenSeconds = solution ? Math.floor((new Date(solution.updatedAt).getTime() - new Date(solution.createdAt).getTime()) / 1000) : null;

        return {
          title: q.title,
          topic: q.topic,
          dataStructure: q.dataStructure,
          algorithm: (q as any).algorithm || null,
          difficulty: q.timeComplexity,
          userSubmittedCode: submissions?.[q.id]?.[language] || "No code submitted",
          performance: {
            testCasesPassed,
            totalTestCases,
            timeTakenSeconds,
            isOptimal: testCasesPassed === totalTestCases && totalTestCases > 0
          }
        };
      })
    };

    const groqApiKey = process.env.GROQ_API_KEY;
    let newAnalysis = null;
    let aiFeedbackObj = null;

    if (groqApiKey) {
      const prompt = `You are an expert technical interviewer and DSA coach.
Analyze the user's performance on their recent Data Structures and Algorithms assessment.
Here is their previous topic proficiency state:
${JSON.stringify(promptData.previousAnalysis, null, 2)}

Here is their performance on the current assessment:
${JSON.stringify(promptData.currentAssessment, null, 2)}

Based on this new data, update their overall proficiency and provide actionable, encouraging feedback for this specific assessment.
If they solved a problem optimally (all test cases passed), consider them strong or medium in that topic (depending on time taken).
If they failed test cases or didn't attempt, consider them weak or medium.
Integrate this with their previous analysis to form a new global understanding.

Return ONLY a JSON object with this exact structure (no markdown, no extra text):
{
  "strongTopics": ["topic1", "topic2"],
  "mediumTopics": ["topic3"],
  "weakTopics": ["topic4"],
  "generalFeedback": "Your specific feedback for this assessment performance. Mention what they did well and what they need to work on."
}`;

      try {
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2,
            response_format: { type: "json_object" }
          })
        });

        if (groqResponse.ok) {
          const groqData = await groqResponse.json();
          const aiResponseText = groqData.choices[0].message.content;
          let cleanedText = aiResponseText;
          const jsonStartIndex = cleanedText.indexOf('{');
          const jsonEndIndex = cleanedText.lastIndexOf('}');
          if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
            cleanedText = cleanedText.substring(jsonStartIndex, jsonEndIndex + 1);
          }
          
          try {
            aiFeedbackObj = JSON.parse(cleanedText);
          } catch (parseErr) {
            console.error("JSON Parse Error on cleaned string:", cleanedText, parseErr);
            aiFeedbackObj = {
              strongTopics: [],
              mediumTopics: [],
              weakTopics: [],
              generalFeedback: "Failed to parse AI feedback. Keep practicing!"
            };
          }
          
          // Save to UserAnalysis
          newAnalysis = await prisma.userAnalysis.upsert({
            where: { userId: user.id },
            update: {
              strongTopics: aiFeedbackObj.strongTopics || [],
              mediumTopics: aiFeedbackObj.mediumTopics || [],
              weakTopics: aiFeedbackObj.weakTopics || [],
              generalFeedback: aiFeedbackObj.generalFeedback || "Keep practicing!"
            },
            create: {
              userId: user.id,
              strongTopics: aiFeedbackObj.strongTopics || [],
              mediumTopics: aiFeedbackObj.mediumTopics || [],
              weakTopics: aiFeedbackObj.weakTopics || [],
              generalFeedback: aiFeedbackObj.generalFeedback || "Keep practicing!"
            }
          });
        } else {
          console.error("Groq API error:", await groqResponse.text());
        }
      } catch (e) {
        console.error("Failed to fetch/parse Groq analysis:", e);
      }
    }

    // Update the unlocked assessment status to COMPLETED and save submissions & testResults & AI Analysis
    const updated = await prisma.unlockedAssessment.update({
      where: {
        userId_assessmentId: {
          userId: user.id,
          assessmentId: assessmentId
        }
      },
      data: {
        status: 'COMPLETED',
        submissions: submissions || {},
        testResults: testResults,
        assessmentAnalysis: aiFeedbackObj || {}
      }
    });

    return NextResponse.json({ success: true, updated, analysis: newAnalysis });
  } catch (error: any) {
    console.error('Assessment finish error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Assessment not found or not unlocked' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'An unexpected error occurred during submission. Please try again.' }, { status: 500 });
  }
}
