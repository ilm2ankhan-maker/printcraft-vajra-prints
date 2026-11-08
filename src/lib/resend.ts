export interface SendProofEmailParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  proofUrl: string;
  productName: string;
}

export interface SendOrderConfirmationEmailParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  itemCount: number;
}

export async function sendOrderConfirmationEmail(params: SendOrderConfirmationEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.includes("123456789")) {
    console.log("[Resend Dev Mode] Order Confirmation dispatched to:", params.customerEmail, params);
    return { success: true, simulated: true };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const data = await resend.emails.send({
      from: "PrintCraft - Vajra Prints <orders@vajraprints.in>",
      to: [params.customerEmail],
      subject: `Order Confirmed: ${params.orderNumber} - PrintCraft by Vajra Prints`,
      html: `
        <div style="font-family: 'Times New Roman', serif; background-color: #FDFBF7; padding: 40px; color: #171717;">
          <h1 style="color: #0D1117; font-size: 26px; border-bottom: 2px solid #D4AF37; padding-bottom: 12px;">
            PrintCraft – Vajra Prints
          </h1>
          <p style="font-size: 16px;">Dear ${params.customerName},</p>
          <p style="font-size: 15px; line-height: 1.6;">
            Thank you for entrusting your print project with Vajra Prints (Prop. Gangadhara / Ganesh). 
            We have received your order <strong>${params.orderNumber}</strong> for ${params.itemCount} item(s) totalling <strong>₹${params.totalAmount.toLocaleString("en-IN")}</strong>.
          </p>
          <div style="background: #ffffff; border: 1px solid #E5E0D8; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              <strong>Next Step:</strong> Our prepress team at Cottonpet will verify artwork alignment, laser vector paths, and foil channels. You will receive an interactive digital proof for final sign-off before printing begins.
            </p>
          </div>
          <p style="font-size: 14px; color: #777;">
            Warm regards,<br/>
            <strong>Vajra Prints Team (Gangadhara / Ganesh)</strong><br/>
            #50, Obbaya Lane, Cottonpet 2nd Cross, Bengaluru - 560053<br/>
            Phone: +91 9945585603
          </p>
        </div>
      `,
    });

    return { success: true, data };
  } catch (err) {
    console.error("Resend send error:", err);
    return { success: false, error: err };
  }
}

export async function sendProofReviewEmail(params: SendProofEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.includes("123456789")) {
    console.log("[Resend Dev Mode] Proof Review email dispatched to:", params.customerEmail, params);
    return { success: true, simulated: true };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/orders/${params.orderNumber}/proof`;

    const data = await resend.emails.send({
      from: "PrintCraft Prepress <proofing@vajraprints.in>",
      to: [params.customerEmail],
      subject: `Action Required: Review Print Proof for Order ${params.orderNumber} (Vajra Prints)`,
      html: `
        <div style="font-family: 'Times New Roman', serif; background-color: #FDFBF7; padding: 40px; color: #171717;">
          <h1 style="color: #0D1117; font-size: 26px; border-bottom: 2px solid #D4AF37; padding-bottom: 12px;">
            PrintCraft – Master Proof Sign-Off
          </h1>
          <p style="font-size: 16px;">Dear ${params.customerName},</p>
          <p style="font-size: 15px; line-height: 1.6;">
            Your custom artwork for <strong>${params.productName}</strong> is prepared for your review by Gangadhara / Ganesh at Vajra Prints.
            Please inspect the trim lines, bleed boundaries, Kannada/English typography, and foil channels carefully.
          </p>
          <div style="margin: 30px 0;">
            <a href="${reviewUrl}" style="background-color: #0D1117; color: #FDFBF7; padding: 14px 28px; text-decoration: none; font-size: 15px; border-radius: 4px; display: inline-block;">
              Review & Approve Proof
            </a>
          </div>
          <p style="font-size: 14px; color: #888;">
            Direct proof portal link: <a href="${reviewUrl}">${reviewUrl}</a><br/>
            Vajra Prints: #50, Obbaya Lane, Cottonpet 2nd Cross, Bengaluru - 560053
          </p>
        </div>
      `,
    });

    return { success: true, data };
  } catch (err) {
    console.error("Resend proof email error:", err);
    return { success: false, error: err };
  }
}

