import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { OrderStatus } from "@prisma/client";
import { sendOrderStatusEmail } from "@/lib/email";

/**
 * PATCH /api/orders/[id]
 * Updates order status — accessible to ADMIN only
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if ((session.user as any).role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden: Admins only" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const statusInput = String(body.status || "").trim().toUpperCase();

  const allowedStatuses = Object.keys(OrderStatus) as Array<
    keyof typeof OrderStatus
  >;

  if (!allowedStatuses.includes(statusInput as keyof typeof OrderStatus)) {
    return NextResponse.json(
      { error: "Invalid order status" },
      { status: 400 }
    );
  }

  try {
    const orderId = parseInt(id, 10);
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: "Invalid order ID" },
        { status: 400 }
      );
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: { id: true, name: true, email: true, address: true },
        },
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const newStatus = OrderStatus[statusInput as keyof typeof OrderStatus];

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
      include: {
        user: {
          select: { id: true, name: true, email: true, address: true },
        },
        orderItems: {
          include: {
            product: {
              select: {
                title: true,
                priceCents: true,
                imageUrl: true, // 👈 only this, no `image`
              },
            },
          },
        },
      },
    });

    // 📧 Email to user with items, product image, and delivery address
    if (updatedOrder.user?.email) {
      const itemsForEmail = updatedOrder.orderItems.map((oi) => ({
        title: oi.product?.title ?? "Item",
        quantity: oi.quantity,
        priceCents: oi.product?.priceCents ?? oi.priceCents ?? 0,
        imageUrl: oi.product?.imageUrl ?? null, // 👈 from Product.imageUrl
      }));

      await sendOrderStatusEmail({
        to: updatedOrder.user.email,
        userName: updatedOrder.user.name,
        status: updatedOrder.status.toString(),
        items: itemsForEmail,
        totalCents: updatedOrder.totalCents ?? undefined,
        address: updatedOrder.user.address ?? null,
      });
    }

    return NextResponse.json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
