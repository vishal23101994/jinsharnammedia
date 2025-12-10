import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

/**
 * GET /api/products
 * Fetch all products (active only)
 */
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });

    // If DB is empty, fallback to initial seed data (optional)
    if (!products.length) {
      return NextResponse.json({
        message: "No products found. Please add new products.",
        products: [],
      });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST /api/products
 * Add new product (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, category, priceCents, imageUrl, sku, active } = body;

    if (!title || !priceCents) {
      return NextResponse.json(
        { error: "Title and price are required." },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        id: sku || crypto.randomUUID(),
        sku: sku || `SKU-${Date.now()}`,
        title,
        description,
        priceCents: Number(priceCents),
        imageUrl: imageUrl || null,
        active: active ?? true,
      },
    });

    return NextResponse.json(
      { message: "Product created successfully", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
