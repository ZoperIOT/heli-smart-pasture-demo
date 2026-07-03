import MetricCard from "../MetricCard.jsx";

export default function StatGrid({ items = [], columns = "md:grid-cols-4" }) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${columns}`}>
      {items.map((item) => (
        <MetricCard key={item.label} label={item.label} value={item.value} unit={item.unit || ""} tone={item.tone || "green"} />
      ))}
    </div>
  );
}
