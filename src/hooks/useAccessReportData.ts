import { useEffect, useState } from "react";

export function useAccessReportData(apiUrl: string) {
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${apiUrl}?key=minha-chave`);
        const data = await res.json();
        setRawData(data);
        setFilteredData(data);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    }

    fetchData();
  }, [apiUrl]);

  function processChartData(data) {
    const uniqueAccess = new Set();
    const uniqueErrors = new Set();

    data.forEach((item) => {
      const isError =
        item.EVDESCR?.toLowerCase().includes("negado") ||
        item.EVDESCR?.toLowerCase().includes("inativo") ||
        item.EVDESCR?.toLowerCase().includes("inválido");

      if (isError) uniqueErrors.add(item.EMPID);
      else uniqueAccess.add(item.EMPID);
    });

    return {
      acessoConcedido: uniqueAccess.size,
      erroDeAcesso: uniqueErrors.size,
    };
  }

  function processCatracas(data) {
    const grouped = {};

    data.forEach((item) => {
      const reader = item.READERDESC;
      const isError =
        item.EVDESCR?.toLowerCase().includes("negado") ||
        item.EVDESCR?.toLowerCase().includes("inativo") ||
        item.EVDESCR?.toLowerCase().includes("inválido");

      if (!grouped[reader]) grouped[reader] = { total: 0, erros: 0 };

      grouped[reader].total += 1;
      if (isError) grouped[reader].erros += 1;
    });

    return Object.entries(grouped)
      .map(([reader, { total, erros }]) => ({
        reader,
        total,
        erros,
        taxaErro: total > 0 ? ((erros / total) * 100).toFixed(1) : "0.0",
      }))
      .sort((a, b) => parseFloat(b.taxaErro) - parseFloat(a.taxaErro));
  }

  function processUsuarios(data) {
    const map = new Map<string, number>();

    data.forEach((item) => {
      const nome = `${item.MIDNAME || ""} ${item.LASTNAME || ""}`.trim();

      const isError =
        item.EVDESCR?.toLowerCase().includes("negado") ||
        item.EVDESCR?.toLowerCase().includes("inativo") ||
        item.EVDESCR?.toLowerCase().includes("inválido");

      if (isError) map.set(nome, (map.get(nome) || 0) + 1);
    });

    return Array.from(map.entries())
      .map(([user, errors]) => ({ user, errors }))
      .sort((a, b) => b.errors - a.errors);
  }

  const chartData = processChartData(filteredData);
  const catracasData = processCatracas(filteredData);
  const usuariosData = processUsuarios(filteredData);

  return {
    rawData,
    filteredData,
    setFilteredData,
    chartData,
    catracasData,
    usuariosData,
  };
}
