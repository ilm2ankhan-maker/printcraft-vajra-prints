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

  // Never create a pretend payment as a real checkout. Require explicit credentials.
  if (keyId.includes("YourTestKeyId") || !keySecret || keySecret.includes("YourTestKeySecret")) {
    throw new Error("Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
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
    console.error("Razorpay API error:", error);
    throw new Error("Razorpay could not create the payment order.");
  }
}

export function verifyRazorpaySignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret || secret.includes("YourTestKeySecret")) {
    return false;
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

