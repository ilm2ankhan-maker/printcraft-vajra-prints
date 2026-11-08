import { NextResponse } from "next/server";
import { getOrderByNumber } from "@/lib/orderStore";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;
  const order = getOrderByNumber(orderNumber);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, order });
}

