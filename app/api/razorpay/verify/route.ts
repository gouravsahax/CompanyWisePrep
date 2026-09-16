import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      amount,
      credits 
    } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET as string)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Process payment success
    const userId = (session.user as any).id;

    // 1. Create Transaction record
    await prisma.transaction.create({
      data: {
        userId: userId,
        razorpayOrderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: parseFloat(amount),
        creditsAdded: parseInt(credits),
        status: "SUCCESS"
      }
    });

    // 2. Update User's credits
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          increment: parseInt(credits)
        }
      }
    });

    return NextResponse.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
