import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

function Piechart({txns = []}){

    let category_dict = {};
    txns.forEach(element => {
        if (element.amount <= 0) return; 
        let pfc = element.personal_finance_category?.primary || "OTHER" ;
        category_dict[pfc] = (category_dict[pfc] || 0)+element.amount;
    });
    console.log("category_dict", category_dict);
    const data = Object.entries(category_dict).map(([name, value]) => ({ name, value })); 
    const COLORS = ["#FF0000", "#808080", "#008000", "#A52A2A", "#64748b"];

    if (data.length === 0) {
        return <p className="text-gray-500 ml-4 mt-4 font-mono">No debit spend to chart.</p>;
      }
    
    return (
        <div className="flex ml-10 max-h-80">
        <div className=" mt-1 rounded-lg bg-zinc-600 p-4 shadow-xl">
            <h2 className = "mt-4 ml-4 text-white"> Here is the pie chart of your spendings.</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#1f2937", border: "none" }}
                itemStyle={{ color: "#f3f4f6" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        </div>
      );

}

export default Piechart;