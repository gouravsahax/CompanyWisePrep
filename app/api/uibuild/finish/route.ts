import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { assessmentId, questionId, html, css, js } = await req.json();

    if (!assessmentId || !questionId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const question = await prisma.uIBuildQuestion.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Call Groq AI to evaluate the UI Build
    let aiScore = 0;
    let aiFeedback: any = {};
    let strongTopics: string[] = [];
    let weakTopics: string[] = [];
    let generalFeedback = "";

    try {
      const prompt = `
You are an expert Front-End Engineer evaluating a candidate's UI Build submission.
The candidate was asked to build the following:
Title: ${question.title}
Description: ${question.description}
Requirements: ${JSON.stringify(question.requirements)}

Here is the candidate's submitted code:
--- HTML ---
${html}
--- CSS ---
${css}
--- JS ---
${js}
--- END CODE ---

Evaluate the submission and return a JSON object ONLY with exactly this structure:
{
  "score": <integer from 0 to 100 representing how well requirements were met and code quality>,
  "strongTopics": ["Array of strings, e.g., 'DOM Manipulation', 'Form Validation' if they did well"],
  "weakTopics": ["Array of strings if they missed things, e.g., 'CSS Grid', 'Event Listeners'"],
  "feedback": "A concise paragraph giving overall feedback to the candidate."
}`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b", // Using the model the user requested earlier
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2,
          response_format: { type: "json_object" }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = JSON.parse(data.choices[0].message.content);
        aiScore = aiResponse.score || 0;
        strongTopics = aiResponse.strongTopics || [];
        weakTopics = aiResponse.weakTopics || [];
        generalFeedback = aiResponse.feedback || "";
        aiFeedback = aiResponse;
      } else {
        console.error("Groq API error in UI build finish:", await response.text());
        // Fallback if API fails
        aiFeedback = { error: "AI analysis failed." };
      }
    } catch (err) {
      console.error("AI Generation Error:", err);
      aiFeedback = { error: "AI analysis failed." };
    }

    // Upsert the user's solution
    await prisma.userUIBuildSolution.upsert({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId: question.id
        }
      },
      update: {
        html,
        css,
        js,
        score: aiScore
      },
      create: {
        userId: user.id,
        questionId: question.id,
        html,
        css,
        js,
        score: aiScore
      }
    });

    // Update global analysis
    const existingAnalysis = await prisma.userAnalysis.findUnique({
      where: { userId: user.id }
    });

    if (existingAnalysis) {
      const currentStrong = (Array.isArray(existingAnalysis.strongTopics) ? existingAnalysis.strongTopics : JSON.parse((existingAnalysis.strongTopics as string) || "[]")) as string[];
      const currentWeak = (Array.isArray(existingAnalysis.weakTopics) ? existingAnalysis.weakTopics : JSON.parse((existingAnalysis.weakTopics as string) || "[]")) as string[];
      
      const newStrong = Array.from(new Set([...currentStrong, ...strongTopics])).slice(0, 5);
      const newWeak = Array.from(new Set([...currentWeak, ...weakTopics])).slice(0, 5);

      await prisma.userAnalysis.update({
        where: { userId: user.id },
        data: {
          strongTopics: newStrong,
          weakTopics: newWeak,
          generalFeedback: existingAnalysis.generalFeedback + "\n\nUI Assessment Update: " + generalFeedback
        }
      });
    } else {
      await prisma.userAnalysis.create({
        data: {
          userId: user.id,
          strongTopics: strongTopics,
          weakTopics: weakTopics,
          mediumTopics: [],
          generalFeedback: generalFeedback
        }
      });
    }

    // Update the assessment status to COMPLETED
    const submissionsPayload = { html, css, js };
    await prisma.unlockedAssessment.update({
      where: {
        userId_assessmentId: {
          userId: user.id,
          assessmentId: assessmentId
        }
      },
      data: {
        status: "COMPLETED",
        submissions: submissionsPayload,
        testResults: { score: aiScore },
        assessmentAnalysis: aiFeedback
      }
    });

    return NextResponse.json({ success: true, aiFeedback });
  } catch (error: any) {
    console.error("Error in uibuild finish:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
