import { requireAdmin } from "@/app/portal/_lib/auth";

export default async function PortalAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return children;
}
