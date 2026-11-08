import { NextResponse } from "next/server";
import { updateOrderStatus, getOrderByNumber } from "@/lib/orderStore";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;
  const body = await req.json();
  const { action, notes } = body;

  const existingOrder = getOrderByNumber(orderNumber);
  if (!existingOrder) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (action === "APPROVE") {
    const updated = updateOrderStatus(orderNumber, {
      proofStatus: "APPROVED",
      status: "PRINTING",
      proofNotes: notes || "Customer signed off proof. Sent to press operator.",
    });

    return NextResponse.json({
      success: true,
      message: "Proof approved successfully! Job advanced to Heidelberg print run.",
      order: updated,
    });
  } else if (action === "REQUEST_REVISION") {
    const updated = updateOrderStatus(orderNumber, {
      proofStatus: "REVISION_REQUESTED",
      proofNotes: notes || "Customer requested prepress artwork adjustments.",
    });

    return NextResponse.json({
      success: true,
      message: "Revision notes submitted. Prepress master will review.",
      order: updated,
    });
  }

  return NextResponse.json(
    { error: "Invalid action. Must be APPROVE or REQUEST_REVISION." },
    { status: 400 }
  );
}

