"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function TrendsChart({
  labels,
  counts,
  avgRatings,
}: {
  labels: string[];
  counts: number[];
  avgRatings: (number | null)[];
}) {
  const data = {
    labels,
    datasets: [
      {
        label: "Count",
        data: counts,
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14,165,233,0.15)",
        tension: 0.35,
        pointRadius: 2,
        yAxisID: "y",
      },
      {
        label: "Avg Rating",
        data: avgRatings,
        borderColor: "#059669",
        backgroundColor: "rgba(5,150,105,0.15)",
        tension: 0.35,
        pointRadius: 2,
        yAxisID: "y1",
      },
    ],
  };

  return (
    <div className="mb-8 rounded border p-4">
      <h2 className="mb-2 font-medium">Trends</h2>
      <Line
        data={data}
        options={{
          responsive: true,
          scales: {
            y: { type: "linear", position: "left", grid: { color: "#eef2f7" } },
            y1: { type: "linear", position: "right", grid: { drawOnChartArea: false }, min: 0, max: 10 },
          },
          plugins: { legend: { position: "bottom" }, tooltip: { intersect: false, mode: "index" } },
        }}
      />
    </div>
  );
}
