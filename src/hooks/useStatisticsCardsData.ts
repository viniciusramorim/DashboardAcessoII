import { useEffect, useState } from "react";
import {
  ChartBarIcon,
  UsersIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";

export const useStatisticsCardsData = (endpoint = "chucri") => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`http://localhost:5000/dados-${endpoint}?key=minha-chave`);
        const data = await response.json();

        if (!Array.isArray(data)) return;

        // Acesso concedido = registros onde EVDESCR não é erro
        const concedidos = new Set(
          data
            .filter((item) => {
              const ev = item.EVDESCR?.toLowerCase();
              return (
                !ev?.includes("negado") &&
                !ev?.includes("inválido") &&
                !ev?.includes("inativo")
              );
            })
            .map((item) => item.EMPID)
        ).size;

        // Acesso negado = todos os registros com erros
        const negados = data.filter((item) => {
          const ev = item.EVDESCR?.toLowerCase();
          return (
            ev?.includes("negado") ||
            ev?.includes("inválido") ||
            ev?.includes("inativo")
          );
        }).length;

        // Qtd de catracas distintas
        const quantCatracas = new Set(data.map((item) => item.READERDESC)).size;

        setCards([
          {
            color: "gray",
            icon: ChartBarIcon,
            title: "Acesso Concedido",
            value: concedidos.toLocaleString("pt-BR"),
            footer: {
              color: "text-green-500",
              value: "",
              label: "",
            },
          },
          {
            color: "gray",
            icon: UserPlusIcon,
            title: "Acesso Negado",
            value: negados.toLocaleString("pt-BR"),
            footer: {
              color: "text-red-500",
              value: "",
              label: "",
            },
          },
          {
            color: "gray",
            icon: UsersIcon,
            title: "Quantidade de Catracas",
            value: quantCatracas.toLocaleString("pt-BR"),
            footer: {
              color: "text-blue-500",
              value: "",
              label: "",
            },
          },
        ]);
      } catch (err) {
        console.error("Erro ao buscar estatísticas:", err);
      }
    };

    fetchStats();
  }, [endpoint]);

  return cards;
};
