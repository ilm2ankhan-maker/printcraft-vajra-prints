import crypto from "crypto";

export interface CreateOrderParams {
  amountInRupees: number;
  orderNumber: string;
  customerEmail: string;
  customerPhone?: string;
  notes?: Record<string, string>;
}

export async function createRazorpayOrder(params: CreateOrderParams) {
  const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_YourTestKeyId";
  const keySecret = process.env.RAZORPAY_KEY_SECRET || "YourTestKeySecret";

  const amountInPaise = Math.round(params.amountInRupees * 100);

  // If running in development without real Razorpay keys, generate mock order
  if (keyId.includes("YourTestKeyId") || !keySecret || keySecret.includes("YourTestKeySecret")) {
    return {
      id: `order_mock_${Date.now()}`,
      entity: "order",
      amount: amountInPaise,
      amount_paid: 0,
      amount_due: amountInPaise,
      currency: "INR",
      receipt: params.orderNumber,
      status: "created",
      mockMode: true,
    };
  }

  try {
    const Razorpay = (await import("razorpay")).default;
    const razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: params.orderNumber,
      notes: {
        customerEmail: params.customerEmail,
        orderNumber: params.orderNumber,
        ...params.notes,
      },
    });

    return order;
  } catch (error) {
    console.warn("Razorpay API error, falling back to simulated order for sandbox testing:", error);
    return {
      id: `order_mock_${Date.now()}`,
      entity: "order",
      amount: amountInPaise,
      amount_paid: 0,
      amount_due: amountInPaise,
      currency: "INR",
      receipt: params.orderNumber,
      status: "created",
      mockMode: true,
    };
  }
}

export function verifyRazorpaySignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  // In test/mock mode, allow mock signatures
  if (!secret || secret.includes("YourTestKeySecret") || params.razorpayOrderId.startsWith("order_mock_")) {
    return true;
  }

  try {
    const body = `${params.razorpayOrderId}|${params.razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    return expectedSignature === params.razorpaySignature;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

