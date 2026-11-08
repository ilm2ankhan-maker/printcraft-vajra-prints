# PrintCraft — Digital Prepress & E-Commerce Platform
> Built for **Vajra Prints**, Bengaluru (Prop: Gangadhara / Ganesh)

PrintCraft is an end-to-end commercial printing web platform designed to streamline 2D print design, 3D packaging previewing, laser cutting price estimations, and prepress order management.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js (App Router), TypeScript
- **Styling:** Tailwind CSS, Lucide Icons
- **2D Design Studio:** Fabric.js (v6) engine with custom template layer architecture
- **3D Product Customizer:** Three.js / React Three Fiber (R3F) dynamic texture mapping
- **State Management:** Zustand
- **Database & Storage:** Prisma, Supabase

---

## 🚀 Key Features

1. **2D Design Studio (`/editor`):** Interactive canvas with prepress bleed lines (3mm trim margins), blank canvas reset, template library (Wedding, Visiting Cards, Certificates), and dynamic SVG/PNG layer handling.
2. **3D Packaging Customizer (`/customizer/box`):** Real-time 3D rigid box rendering. Supports live 2D-to-3D wrapper texture mapping and color theme reset logic.
3. **Laser Cutting Engine (`/laser-cutting`):** Instant SVG perimeter parsing and material dynamic pricing calculator.
4. **Staff Admin Dashboard (`/admin`):** Secure prepress pipeline queue (`PLACED` → `PAID` → `PROOFING` → `PRINTING` → `SHIPPED`) protected by staff authentication.

---

## 👥 Platform Architecture & Engineering Team

Engineered in collaboration with the Department of Information Science & Engineering, **CMR Institute of Technology, Bengaluru**:

- **Ilmaan Khan** (1CR24IS079) — *Lead Architect & Full-Stack Systems* ([ilm2ankhan@gmail.com](mailto:ilm2ankhan@gmail.com))
- **Manish M** (1CR24IS096) — *UI/UX & Interactive Design Lead* ([manish.ise24@cmrit.ac.in](mailto:manish.ise24@cmrit.ac.in))
- **Divyanshu** (1CR24IS068) — *3D Graphics & Prepress Engineer* ([divyanshu.ise24@cmrit.ac.in](mailto:divyanshu.ise24@cmrit.ac.in))

---

## 🏃 Local Setup Instructions

```bash
# Clone the repository
git clone [https://github.com/ilm2ankhan-maker/printcraft-vajra-prints.git](https://github.com/ilm2ankhan-maker/printcraft-vajra-prints.git)

# Install dependencies
npm install

# Run development server
npm run dev