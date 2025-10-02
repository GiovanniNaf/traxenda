export default function StatCard({
    title,
    value,
    change,
    icon,
    color
  }: {
    title: string;
    value: string;
    change: string;
    icon: string;
    color: string;
  }) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className={`text-xs mt-1 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {change} vs ayer
            </p>
          </div>
          <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}>
            <span className="text-xl">{icon}</span>
          </div>
        </div>
      </div>
    );
  }