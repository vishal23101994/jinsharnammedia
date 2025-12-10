import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, totalCents, paymentId } = await request.json();

    const order = await prisma.order.create({
      data: {
        userId: Number(session.user.id),
        totalCents,
        paymentId: paymentId || null,
        orderItems: {
          createMany: {
            data: items.map((item: any) => ({
              productId: Number(item.id),
              quantity: item.qty,
              priceCents: item.priceCents,
            })),
          },
        },
      },
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
