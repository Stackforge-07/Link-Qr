import { Metadata } from "next";
import LinkTable from "@/components/LinkTable";

export const metadata: Metadata = {
  title: "Dashboard — SecureQR",
  description: "View and manage your generated secure QR links.",
};

export default function DashboardPage() {
  return (
    <>
      <div className="dashboard-header">
        <h1>Your Links</h1>
        <p>View, track, and manage all QR links you&apos;ve generated.</p>
      </div>

      <LinkTable />
    </>
  );
}
