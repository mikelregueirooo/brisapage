import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Admin | El Brisa" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <AdminSidebar />
      {/* Main area — offset for mobile topbar */}
      <div className="flex-1 flex flex-col min-w-0 pt-14 lg:pt-0">
        {children}
      </div>
    </div>
  );
}
