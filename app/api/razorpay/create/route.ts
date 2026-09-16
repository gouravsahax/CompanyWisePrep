import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY as string,
  key_secret: process.env.RAZORPAY_API_SECRET as string,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, credits, currency } = await req.json();

    if (!amount || !credits) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Razorpay amount is in smallest currency unit (e.g., paise, cents)
    const options = {
      amount: amount * 100,
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}_${session.user.email}`,
      notes: {
        userId: (session.user as any).id,
        credits: credits.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
