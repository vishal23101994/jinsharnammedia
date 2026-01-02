import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { OrderStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      deliveryCharge,
    } = body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        { success: false, message: "Missing payment details" },
        { status: 400 }
      );
    }

    // 🔐 Verify Razorpay signature
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }

    // 🔐 Recalculate total from DB
    const productIds = items.map((i: any) => i.id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let totalCents = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = productMap.get(item.id);
      if (!product) continue;

      totalCents += product.priceCents * Number(item.qty || 1);
      orderItemsData.push({
        productId: product.id,
        priceCents: product.priceCents,
        quantity: Number(item.qty || 1),
      });
    }

    totalCents += Number(deliveryCharge || 0) * 100;

    // ✅ Create order in DB
    await prisma.order.create({
      data: {
        userId: Number(session.user.id),
        totalCents,
        status: OrderStatus.PAID,
        paymentId: razorpay_payment_id,
        paymentStatus: "PAID",
        orderItems: {
          create: orderItemsData,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
