// import DashboardLayout from "../components/DashboardLayout";
import DashboardLayout from "../Component/DashboardLayout";
import KPICards from "../Component/KpiCards";

export default function DashboardPage() {
  const stats = [
    { title: "Total Users", value: 42, icon: "👤", color: "bg-yellow-500" },
    { title: "Active Workspaces", value: 8, icon: "🏢", color: "bg-indigo-500" },
    { title: "Pending Approvals", value: 3, icon: "⏳", color: "bg-red-500" },
    { title: "Revenue", value: "$12.4K", icon: "💰", color: "bg-green-500" },
    { title: "New Signups", value: 7, icon: "🆕", color: "bg-purple-500" },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard</h1>
      <KPICards stats={stats} />
    </DashboardLayout>
  );
}
