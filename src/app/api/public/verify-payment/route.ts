import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

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

/* ---------------- VERIFY PAYMENT ---------------- */

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      deliveryCharge,
      name,
      phone,
      address,
      city,
      pincode
    } = body;

    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(sign)
      .digest("hex");

    if(expectedSign !== razorpay_signature){

      return new Response(
        JSON.stringify({ success:false }),
        { headers:corsHeaders }
      );

    }

    const productIds = items.map((i:any)=>i.id);

    const products = await prisma.product.findMany({
      where:{ id:{ in:productIds }}
    });

    const productMap = new Map(products.map(p=>[p.id,p]));

    let total = 0;

    const orderItems:any = [];

    for(const item of items){

      const product = productMap.get(item.id);
      if(!product) continue;

      total += product.priceCents * item.qty;

      orderItems.push({
        productId: product.id,
        priceCents: product.priceCents,
        quantity: item.qty
      });

    }

    total += deliveryCharge * 100;

    await prisma.order.create({
      data:{
        totalCents: total,
        status: OrderStatus.PAID,
        paymentId: razorpay_payment_id,
        paymentStatus:"PAID",

        customerName: name,
        customerPhone: phone,
        address,
        city,
        pincode,

        orderItems:{
          create:orderItems
        }
      }
    });

    return new Response(
      JSON.stringify({ success:true }),
      { headers:corsHeaders }
    );

  } catch (error) {

    console.error("Verify payment error:", error);

    return new Response(
      JSON.stringify({ success:false }),
      {
        status:500,
        headers:corsHeaders
      }
    );

  }

}