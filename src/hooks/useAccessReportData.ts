import { useEffect, useState, useRef } from "react";

export function useAccessReportData(apiUrl: string) {
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedCatraca, setSelectedCatraca] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch(`${apiUrl}?key=minha-chave`);
      const data = await res.json();

      if (!Array.isArray(data)) return;

      setRawData(data);
      setLastUpdated(new Date());

      // Aplica o filtro se estiver ativo
      if (selectedUser) {
        const nome = selectedUser.trim();
        const filtrado = data.filter((item) => {
          const fullName = `${item.MIDNAME || ""} ${item.LASTNAME || ""}`.trim();
          return fullName === nome;
        });
        setFilteredData(filtrado);
      } else if (selectedCatraca) {
        const filtrado = data.filter((item) => item.READERDESC === selectedCatraca);
        setFilteredData(filtrado);
      } else {
        setFilteredData(data);
      }
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
  };

  useEffect(() => {
    fetchData(); // inicial
    const interval = setInterval(() => fetchData(), 60000); // a cada 1 min
    return () => clearInterval(interval);
  }, [apiUrl, selectedUser, selectedCatraca]);

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
    setSelectedUser,
    setSelectedCatraca,
    clearSelection: () => {
      setSelectedUser(null);
      setSelectedCatraca(null);
      setFilteredData(rawData);
    },
    lastUpdated,
  };
}
