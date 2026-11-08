import { NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";
import { saveOrder } from "@/lib/orderStore";
import { OrderRecord } from "@/lib/mockData";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      taxAmount,
      shippingFee,
      totalAmount,
    } = body;

    if (!customerEmail || !customerName || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required order parameters." },
        { status: 400 }
      );
    }

    // Generate unique order number (e.g. II-2026-8941)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `II-2026-${randomSuffix}`;

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder({
      amountInRupees: totalAmount,
      orderNumber,
      customerEmail,
      customerPhone,
      notes: {
        customerName,
        itemCount: String(items.length),
      },
    });

    // Save initial order in state
    const newOrder: OrderRecord = {
      id: `ord_${Date.now()}`,
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items: items.map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        selectedOptions: item.selectedOptions,
        designId: item.designSnapshot?.title,
        laserSpecs: item.laserSpecs,
      })),
      subtotal,
      taxAmount,
      shippingFee,
      totalAmount,
      currency: "INR",
      status: "PLACED",
      proofStatus: "PENDING",
      courierName: "Shiprocket / BlueDart Air",
      createdAt: new Date().toISOString(),
    };

    saveOrder(newOrder);

    return NextResponse.json({
      success: true,
      orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      mockMode: (razorpayOrder as any).mockMode || false,
    });
  } catch (err: any) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to initiate checkout order." },
      { status: 500 }
    );
  }
}

