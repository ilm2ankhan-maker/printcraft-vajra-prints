import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "PrintCraft | Vajra Prints - Bespoke Printing, Laser Engraving & Custom Name Plates",
  description:
    "Official digital atelier for Vajra Prints, Cottonpet, Bengaluru. Wedding Cards & Customized Envelopes, Laser Engraving & Cutting, Custom Name Plates (Gold, Silver, Copper, Pink), Visiting Cards, Event Invitations, Certificates, & Brochures.",
  keywords: [
    "PrintCraft",
    "Vajra Prints",
    "Printers in Cottonpet Bengaluru",
    "Wedding Cards Bengaluru",
    "Laser Engraving Bengaluru",
    "Custom Name Plates Gold Silver Copper Pink",
    "Visiting Cards",
    "Customized Envelopes",
    "Brochures and Certificates",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#FDFBF7] text-[#171717]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
