import React from "react";

export default function UsersTable({ data, onRowClick, selectedUser }) {
  return (
    <div className="overflow-y-auto max-h-[40vh]">
      <table className="w-full table-auto text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2 text-sm text-gray-600">Usuário</th>
            <th className="border-b p-2 text-sm text-gray-600">Erros</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ user, errors }, index) => {
            const width = Math.min(errors * 5, 100);
            const color =
              errors <= 5 ? "bg-green-500" :
              errors <= 10 ? "bg-yellow-500" : "bg-red-500";

            return (
              <tr
                key={index}
                onClick={() => onRowClick(user)}
                className={`cursor-pointer hover:bg-blue-50 ${
                  selectedUser === user ? "bg-blue-100 font-semibold" : ""
                }`}
              >
                <td className="p-2 border-b text-sm">{user}</td>
                <td className="p-2 border-b text-sm">
                  <div className="relative w-full h-2 bg-gray-200 rounded">
                    <div className={`absolute left-0 top-0 h-2 rounded ${color}`} style={{ width: `${width}%` }} />
                  </div>
                  <span className="ml-2 text-xs text-gray-600">{errors}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
