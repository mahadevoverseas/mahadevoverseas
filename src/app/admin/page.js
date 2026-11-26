import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-session";
import { readContent, readEnquiries } from "@/lib/content";
import AdminApp from "@/components/admin/AdminApp";

export const metadata = { title: "Dashboard" };

async function AdminData() {
  if (!(await isAdmin())) redirect("/admin/login");
  const [content, enquiries] = await Promise.all([readContent(), readEnquiries()]);
  return <AdminApp initialContent={content} initialEnquiries={enquiries} />;
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="grid min-h-svh place-items-center text-sm text-navy/60">Loading admin…</div>}>
      <AdminData />
    </Suspense>
  );
}
