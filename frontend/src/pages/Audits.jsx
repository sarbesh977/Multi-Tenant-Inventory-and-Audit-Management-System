import React from "react";
import { useInventory } from "../context/InventoryContext";

export default function Audits() {
  const { transactions } = useInventory();
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Audit Trail</h1>
        <p className="text-slate-500 text-sm">
          Historical record of all stock movements
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-semibold text-slate-600 text-sm">
                Timestamp
              </th>
              <th className="p-4 font-semibold text-slate-600 text-sm">
                Item Name
              </th>
              <th className="p-4 font-semibold text-slate-600 text-sm text-center">
                Change
              </th>
              <th className="p-4 font-semibold text-slate-600 text-sm">
                Description / Reference
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[...transactions].reverse().map((log) => (
              <tr
                key={log.timestamp}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="p-4 text-xs text-slate-500 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="p-4 text-sm font-semibold text-slate-700">
                  {log.itemName}
                </td>

                <td className="p-4 text-sm text-center">
                  <span
                    className={`font-bold px-2 py-1 rounded text-xs ${
                      log.change.startsWith("+")
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {log.change}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-600 italic">
                  {log.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <div className="p-20 text-center">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-slate-400">No transactions recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
