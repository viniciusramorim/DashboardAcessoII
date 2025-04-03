import { useEffect, useState } from "react";
import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

export const useStatisticsCardsData = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/dados-chucri?key=minha-chave");
        const data = await response.json();

        if (!Array.isArray(data)) return;

        const totalEventosHoje = new Set(data.map());
        const usuariosUnicosHoje = new Set(data.map(item => item.EMPID)).size;

        // Exemplo de mais métricas
        const dispositivosUnicos = new Set(data.map(item => item.DEVID)).size;

        const cardsData = [
          {
            color: "gray",
            icon: ChartBarIcon,
            title: "Total de Acessos",
            value: totalEventosHoje.toLocaleString("pt-BR"),
            footer: {
              color: "text-green-500",
              value: "+15%",
              label: "",
            },
          },
          {
            color: "gray",
            icon: UsersIcon,
            title: "Usuários Únicos",
            value: usuariosUnicosHoje.toLocaleString("pt-BR"),
            footer: {
              color: "text-green-500",
              value: "+2%",
              label: "comparado a ontem",
            },
          },
          {
            color: "gray",
            icon: UserPlusIcon,
            title: "Dispositivos Acessados",
            value: dispositivosUnicos.toLocaleString("pt-BR"),
            footer: {
              color: "text-green-500",
              value: "+1%",
              label: "comparado a semana passada",
            },
          },
        ];

        setCards(cardsData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  return cards;
};
