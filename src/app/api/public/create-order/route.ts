import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

/* ---------------- CORS ---------------- */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

/* ---------------- CREATE ORDER ---------------- */

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      items,
      deliveryCharge,
      name,
      phone,
      address,
      city,
      pincode
    } = body;

    if (!items?.length) {
      return new Response(
        JSON.stringify({ error: "Cart empty" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const productIds = items.map((i:any)=>i.id);

    const products = await prisma.product.findMany({
      where:{ id:{ in:productIds }}
    });

    const productMap = new Map(products.map(p=>[p.id,p]));

    let total = 0;

    for(const item of items){

      const product = productMap.get(item.id);
      if(!product) continue;

      total += product.priceCents * item.qty;

    }

    total += deliveryCharge * 100;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: total,
      currency: "INR",
      receipt: `order_${Date.now()}`
    });

    return new Response(
      JSON.stringify({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );

  } catch (error) {

    console.error("Create order error:", error);

    return new Response(
      JSON.stringify({ error: "Server error" }),
      {
        status: 500,
        headers: corsHeaders
      }
    );

  }

}