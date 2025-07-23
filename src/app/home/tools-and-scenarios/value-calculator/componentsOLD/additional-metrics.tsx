"use client";

const metricsData = [
    { label: "Oper.", value: "90%", color: "bg-green-500" },
    { label: "Capf.", value: "80%", color: "bg-blue-500" },
    { label: "Produ.", value: "75%", color: "bg-yellow-500" },
    { label: "25%", value: "25%", color: "bg-orange-500" },
    { label: "21%", value: "21%", color: "bg-purple-500" },
    { label: "23%", value: "23%", color: "bg-green-400" },
    { label: "20%", value: "20%", color: "bg-blue-400" },
    { label: "19%", value: "19%", color: "bg-yellow-400" },
    { label: "15%", value: "15%", color: "bg-orange-400" },
    { label: "40%", value: "40%", color: "bg-purple-400" },
    { label: "17%", value: "17%", color: "bg-pink-500" },
    { label: "40%", value: "40%", color: "bg-indigo-500" },
];

export function AdditionalMetrics() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {metricsData.map((metric, index) => (
                <div key={index} className={`${metric.color} text-white p-2 rounded text-center`}>
                    <div className="text-sm font-medium">{metric.value}</div>
                </div>
            ))}
        </div>
    );
}
