import { NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { updateOrderStatus, getOrderByNumber } from "@/lib/orderStore";
import { sendOrderConfirmationEmail } from "@/lib/resend";
import { createShiprocketShipment } from "@/lib/shiprocket";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderNumber,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = body;

    if (!orderNumber || !razorpayOrderId) {
      return NextResponse.json(
        { error: "Missing required verification parameters." },
        { status: 400 }
      );
    }

    // Verify cryptographic signature
    const isValid = verifyRazorpaySignature({
      razorpayOrderId,
      razorpayPaymentId: razorpayPaymentId || `pay_sim_${Date.now()}`,
      razorpaySignature: razorpaySignature || "simulated_sig",
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature verification failed." },
        { status: 400 }
      );
    }

    // Update order status to PAID and pipeline to PROOFING
    const updatedOrder = updateOrderStatus(orderNumber, {
      status: "PAID",
      proofStatus: "PENDING",
      paymentMethod: "Razorpay (UPI / Cards)",
      paymentId: razorpayPaymentId || `pay_sim_${Date.now()}`,
    });

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // Dispatch order confirmation email via Resend
    await sendOrderConfirmationEmail({
      orderNumber: updatedOrder.orderNumber,
      customerName: updatedOrder.customerName,
      customerEmail: updatedOrder.customerEmail,
      totalAmount: updatedOrder.totalAmount,
      itemCount: updatedOrder.items.length,
    });

    // Create logistics shipment record via Shiprocket
    const shipmentResult = await createShiprocketShipment({
      orderId: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      orderDate: updatedOrder.createdAt,
      billingCustomerName: updatedOrder.customerName,
      billingAddress: updatedOrder.shippingAddress.line1,
      billingCity: updatedOrder.shippingAddress.city,
      billingPincode: updatedOrder.shippingAddress.postalCode,
      billingState: updatedOrder.shippingAddress.state,
      billingEmail: updatedOrder.customerEmail,
      billingPhone: updatedOrder.customerPhone,
      orderItems: updatedOrder.items.map((i) => ({
        name: i.productName,
        sku: i.productId,
        units: i.quantity,
        sellingPrice: i.unitPrice,
      })),
      subTotal: updatedOrder.subtotal,
    });

    if (shipmentResult && shipmentResult.awb_code) {
      updateOrderStatus(orderNumber, {
        trackingNumber: shipmentResult.awb_code,
        courierName: shipmentResult.courier_name,
        trackingUrl: shipmentResult.tracking_url,
      });
    }

    return NextResponse.json({
      success: true,
      orderNumber: updatedOrder.orderNumber,
      status: updatedOrder.status,
    });
  } catch (err: any) {
    console.error("Payment verification error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to verify payment." },
      { status: 500 }
    );
  }
}

