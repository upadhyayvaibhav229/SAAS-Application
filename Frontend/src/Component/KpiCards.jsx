import {
  UsersIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";

export default function KpiCards() {
  const kpis = [
    {
      title: "Total Users",
      value: 1240,
      icon: UsersIcon,
      trend: "+12%",
      trendColor: "text-green-500",
    },
    {
      title: "New Orders",
      value: 342,
      icon: ShoppingCartIcon,
      trend: "-4%",
      trendColor: "text-red-500",
    },
    {
      title: "Revenue",
      value: "$23,400",
      icon: CurrencyDollarIcon,
      trend: "+8%",
      trendColor: "text-green-500",
    },
    {
      title: "Active Projects",
      value: 12,
      icon: ChartPieIcon,
      trend: "+3%",
      trendColor: "text-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          className="bg-white shadow rounded-lg p-5 flex items-center justify-between"
        >
          <div>
            <h4 className="text-gray-500 text-sm font-medium">{kpi.title}</h4>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{kpi.value}</p>
            <p className={`mt-1 text-sm font-medium ${kpi.trendColor}`}>{kpi.trend}</p>
          </div>
          <div className="bg-indigo-100 p-3 rounded-full">
            <kpi.icon className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      ))}
    </div>
  );
}
