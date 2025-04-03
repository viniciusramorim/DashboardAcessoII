import React from "react";

export default function CatracasTable({ data, onRowClick, selectedReader }) {
  return (
    <div className="overflow-y-auto max-h-[40vh]">
      <table className="w-full table-auto text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2 text-sm text-gray-600">Catraca</th>
            <th className="border-b p-2 text-sm text-gray-600">Taxa de Erros</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ reader, taxaErro }, index) => {
            const erro = parseFloat(taxaErro);
            const color =
              erro <= 2 ? "bg-green-500" :
              erro <= 5 ? "bg-yellow-500" : "bg-red-500";

            return (
              <tr
                key={index}
                onClick={() => onRowClick(reader)}
                className={`cursor-pointer hover:bg-blue-50 ${
                  selectedReader === reader ? "bg-blue-100 font-semibold" : ""
                }`}
              >
                <td className="p-2 border-b text-sm">{reader}</td>
                <td className="p-2 border-b text-sm">
                  {taxaErro}%
                  <span className={`inline-block ml-2 w-2 h-2 rounded-full ${color}`} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
