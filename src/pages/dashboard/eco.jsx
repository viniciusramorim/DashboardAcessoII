import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
} from "@material-tailwind/react";
import { StatisticsCard } from "@/widgets/cards";
import { useStatisticsCardsData } from "@/hooks/useStatisticsCardsData";
import DoughnutChartAccess from "@/components/charts/DoughnutChartAccess";
import { useAccessReportData } from "@/hooks/useAccessReportData";
import CatracasTable from "@/components/tables/CatracasTable";
import UsersTable from "@/components/tables/UsersTable";

export function Eco() {
  const {
    rawData,
    filteredData,
    setFilteredData,
    chartData,
    catracasData,
    usuariosData,
  } = useAccessReportData("http://localhost:5000/dados-eco");

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCatraca, setSelectedCatraca] = useState(null);

  const handleUserClick = (userName) => {
    setSelectedUser(userName);
    setSelectedCatraca(null);

    const newData = rawData.filter((item) => {
      const nome = `${item.MIDNAME || ""} ${item.LASTNAME || ""}`.trim();
      return nome === userName;
    });

    setFilteredData(newData);
  };

  const handleCatracaClick = (reader) => {
    setSelectedCatraca(reader);
    setSelectedUser(null);

    const newData = rawData.filter((item) => item.READERDESC === reader);
    setFilteredData(newData);
  };

  const clearSelection = () => {
    setSelectedUser(null);
    setSelectedCatraca(null);
    setFilteredData(rawData);
  };


  useEffect(() => {
    const clickOutside = (e) => {
      const target = e.target;
  
      const isClickInsideTable = target.closest("table");
      const isCheckbox = target.tagName === "INPUT";
  
      if (!isClickInsideTable && !isCheckbox) {
        if (selectedUser || selectedCatraca) {
          setSelectedUser(null);
          setSelectedCatraca(null);
          setFilteredData(rawData); 
        }
      }
    };
  
    document.addEventListener("click", clickOutside);
    return () => document.removeEventListener("click", clickOutside);
  }, [rawData, selectedUser, selectedCatraca]);
  

  const cards = useStatisticsCardsData("eco");

  return (
    <div className="mt-4 w-full px-4">
      {/* KPIs Cards */}
      <div className="mb-6 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ title, value, footer, color, icon: Icon }, index) => (
          <StatisticsCard
            key={index}
            title={title}
            value={value}
            icon={<Icon className="h-6 w-6 text-blue-500" />} // Corrigido
            color={color}
            footer={
              <Typography
                variant="small"
                className={`font-normal ${footer.color}`}
              >
                {footer.value}
                <span className="ml-1 text-gray-600">{footer.label}</span>
              </Typography>
            }
          />
        ))}
      </div>

      {/* Gráfico + Tabelas */}
      <div className="mb-3 flex flex-col gap-4 md:flex-row md:gap-6 xl:gap-6">
        <div className="mb-1 w-full md:w-96 xl:w-1/3">
          <Card className="p-4 h-full">
            <Typography variant="h6" className="mb-3 text-center">
              Resumo dos Acessos
            </Typography>
            <DoughnutChartAccess
              acessoConcedido={chartData.acessoConcedido}
              erroDeAcesso={chartData.erroDeAcesso}
            />
          </Card>
        </div>

        <div className="w-full xl:w-2/3">
          <Card className="p-4 mb-4">
            <Typography variant="h6" className="mb-2">
              Taxa de Erro por Catraca
            </Typography>
            <CatracasTable
              data={catracasData}
              onRowClick={handleCatracaClick}
              selectedReader={selectedCatraca}
            />
          </Card>

          <Card className="p-4">
            <Typography variant="h6" className="mb-2">
              Erros por Usuário
            </Typography>
            <UsersTable
              data={usuariosData}
              onRowClick={handleUserClick}
              selectedUser={selectedUser}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Eco;
