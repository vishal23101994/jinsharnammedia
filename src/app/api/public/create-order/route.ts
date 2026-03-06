import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {

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
    return NextResponse.json({ error: "Cart empty" }, { status: 400 });
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
  });

  return NextResponse.json({
    id: order.id,
    amount: order.amount,
    currency: order.currency,
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  });
}