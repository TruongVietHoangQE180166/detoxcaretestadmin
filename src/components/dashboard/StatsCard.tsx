type StatsCardProps = {
  title: string;
  value: string | number;
  color?: string;
};

const StatsCard = ({ title, value, color = "bg-blue-500" }: StatsCardProps) => {
  return (
    <div className={`${color} text-white p-4 rounded-2xl shadow-md`}>
      <h3 className="text-lg">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default StatsCard;
