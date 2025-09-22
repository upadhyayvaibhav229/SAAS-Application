export default function KPICards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`flex items-center justify-between p-4 rounded-xl shadow-lg ${stat.color} bg-opacity-80`}
        >
          <div>
            <h3 className="text-gray-200 text-lg font-semibold">{stat.title}</h3>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
          <div className="text-4xl">{stat.icon}</div>
        </div>
      ))}
    </div>
  );
}
