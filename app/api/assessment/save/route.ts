import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { assessmentId, submissions } = body;

    if (!assessmentId) {
      return NextResponse.json({ success: false, error: 'Missing assessmentId' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Update the unlocked assessment to save submissions (auto-save)
    const updated = await prisma.unlockedAssessment.update({
      where: {
        userId_assessmentId: {
          userId: user.id,
          assessmentId: assessmentId
        }
      },
      data: {
        submissions: submissions || {}
      }
    });

    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    console.error('Assessment save error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Assessment not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
