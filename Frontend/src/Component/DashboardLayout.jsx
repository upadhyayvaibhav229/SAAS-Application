import Header from "./Header";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <div className="flex-1 flex flex-col">
        <main className="p-6 bg-gray-900 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
