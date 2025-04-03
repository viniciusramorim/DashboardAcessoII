import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChartAccess({ acessoConcedido, erroDeAcesso }: {
  acessoConcedido: number;
  erroDeAcesso: number;
}) {
  const data = {
    labels: ["Acesso Concedido", "Erro de Acesso"],
    datasets: [
      {
        data: [acessoConcedido, erroDeAcesso],
        backgroundColor: ["#4CAF50", "#F44336"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Doughnut data={data} options={options} />
    </div>
  );
}
