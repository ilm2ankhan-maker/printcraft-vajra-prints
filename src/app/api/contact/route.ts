import { NextResponse } from "next/server";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  quantity: string;
  message: string;
  createdAt: string;
}

const inquiries: Inquiry[] = [];

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Inquiry>;
  if (!body.name?.trim() || !body.email?.trim() || !body.phone?.trim()) {
    return NextResponse.json({ error: "Name, email, and phone are required." }, { status: 400 });
  }

  const inquiry: Inquiry = {
    id: `inq_${Date.now()}`,
    name: body.name.trim(),
    email: body.email.trim(),
    phone: body.phone.trim(),
    inquiryType: body.inquiryType || "general",
    quantity: body.quantity || "",
    message: body.message?.trim() || "",
    createdAt: new Date().toISOString(),
  };
  inquiries.unshift(inquiry);

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: "PrintCraft <website@vajraprints.in>",
        to: [process.env.CONTACT_EMAIL || "vajraprints3245@gmail.com"],
        replyTo: inquiry.email,
        subject: `New ${inquiry.inquiryType} inquiry from ${inquiry.name}`,
        text: `Name: ${inquiry.name}\nPhone: ${inquiry.phone}\nEmail: ${inquiry.email}\nQuantity: ${inquiry.quantity}\nDetails:\n${inquiry.message}`,
      });
    } catch (error) {
      console.error("Contact inquiry email failed:", error);
    }
  }

  return NextResponse.json({ success: true, inquiryId: inquiry.id });
}
