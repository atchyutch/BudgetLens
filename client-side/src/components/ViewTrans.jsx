import React from "react";
import axios from "axios";

function ViewTrans({data}){
    return (<>
    <h2 className = "ml-4 mt-4 font-mono">Here are the transactions from the last 30 days.</h2>
    <div className=" ml-4 rounded-lg shadow mt-6 w-250">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((t) => (
            <tr key={t.transaction_id}>
              <td className="px-4 py-2">
                {new Date(t.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                })}
              </td>
              <td className="px-4 py-2">{t.merchant_name || t.name}</td>
              {/* <td className="px-4 py-2">{t.category?.[0] ?? "-"}</td> */}
              <td className="px-4 py-2">
                {t.pending ? (
                  <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
                    Pending
                  </span>
                ) : (
                  <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">
                    Posted
                  </span>
                )}
              </td>
              <td
                className={`px-4 py-2 text-right ${
                  t.amount < 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {t.amount.toLocaleString("en-IN", {
                  style: "currency",
                  currency: t.iso_currency_code ?? "USD",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>);
}

export default ViewTrans;
