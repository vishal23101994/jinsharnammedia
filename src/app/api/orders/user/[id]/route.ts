import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session: any = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requestedId = parseInt(params.id, 10);
  if (isNaN(requestedId)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  const isAdmin =
    session.user.role === "ADMIN" || session.user.role === "admin";

  // non-admin can only see their own orders
  if (!isAdmin && requestedId !== Number(session.user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: requestedId },
    include: {
      orderItems: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
