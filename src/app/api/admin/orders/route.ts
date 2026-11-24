import { NextResponse } from "next/server";
import { getAllOrders, updateOrderStatus } from "@/lib/orderStore";
import { sendProofReviewEmail } from "@/lib/resend";
import type { OrderRecord } from "@/lib/mockData";

function requireAdmin(req: Request) {
  return req.headers.get("cookie")?.includes("printcraft_admin=authenticated") === true;
}

export async function GET(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const orders = getAllOrders();
  return NextResponse.json({ success: true, orders });
}

export async function PATCH(req: Request) {
  try {
    if (!requireAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const body = await req.json();
    const { orderNumber, status, proofStatus, proofNotes, trackingNumber, courierName, triggerProofEmail } = body;

    if (!orderNumber) {
      return NextResponse.json({ error: "Order number is required." }, { status: 400 });
    }

    const updates: Partial<OrderRecord> = {};
    if (status) updates.status = status;
    if (proofStatus) updates.proofStatus = proofStatus;
    if (proofNotes !== undefined) updates.proofNotes = proofNotes;
    if (trackingNumber) updates.trackingNumber = trackingNumber;
    if (courierName) updates.courierName = courierName;

    const updated = updateOrderStatus(orderNumber, updates);
    if (!updated) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // If staff clicked "Send Proof Review Email"
    if (triggerProofEmail) {
      await sendProofReviewEmail({
        orderNumber: updated.orderNumber,
        customerName: updated.customerName,
        customerEmail: updated.customerEmail,
        productName: updated.items[0]?.productName || "Bespoke Stationery",
        proofUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/orders/${updated.orderNumber}/proof`,
      });
      updateOrderStatus(orderNumber, { proofStatus: "SENT_FOR_REVIEW" });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: unknown) {
    console.error("Admin order update error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update order" },
      { status: 500 }
    );
  }
}

