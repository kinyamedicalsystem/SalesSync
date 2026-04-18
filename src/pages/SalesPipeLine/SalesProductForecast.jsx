import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);
export default function ProductForecast() {
    const API=import.meta.env.VITE_BACKEND_URL;
    const [records, setRecords] = useState([])

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    }
        
    useEffect(() => {
        axios.get(`${API}/api/records`)
            .then(res => setRecords(res.data))
            .catch(err => console.log(err))
    }, [])

    const productMap = {};

    records.forEach(r => {
        const product = r.productName || "Unknown";
        const stage = r.pipelineStage || "Unknown";



        if (!productMap[product]) {
            productMap[product] = {
                count: 0,
                totalPotential: 0,
                totalForecast: 0,
                totalWinning: 0,
                stages: {}
            };
        }

        productMap[product].count += 1;
        productMap[product].totalPotential += r.potentialValue || 0;
        productMap[product].totalForecast += r.weightedForecast || 0;
        productMap[product].totalWinning += r.winningPercentage || 0;
        productMap[product].stages[stage] = (productMap[product].stages[stage] || 0) + 1;
    });

    const productData = Object.keys(productMap).map(product => {
        const data = productMap[product];
        const progress = data.totalPotential > 0 ? (data.totalForecast / data.totalPotential) * 100
            : 0;

        return {
            name: product,
            opportunities: data.count,
            potential: data.totalPotential,
            forecast: data.totalForecast,
            avgDeal: data.totalPotential / data.count,
            winRate: data.totalWinning / data.count,
            stages: data.stages,
            progress: progress
        };
    });

    const barData = useMemo(() => {
        const productMap = {}
        records.forEach(r => {
            const product = r.productName || "Unknown";

            if (!productMap[product]) {
                productMap[product] = {
                    potential: 0,
                    forecast: 0
                };
            }

            productMap[product].potential += r.potentialValue || 0;
            productMap[product].forecast += r.weightedForecast || 0;
            // 👉 revenue based chart
        });
        const labels = Object.keys(productMap);
        return {
            labels,
            datasets: [
                {
                    label: "Potential Value (₹)",
                    data: labels.map(p => productMap[p].potential),
                    backgroundColor: "#eb0cff47",
                    borderColor:"#eb0cff",
                    borderWidth: 1,
                    borderRadius: 12
                },
                {
                    label: "Weighted Forecast (₹)",
                    data: labels.map(p => productMap[p].forecast),
                    backgroundColor: "#08ffff37",
                    borderColor:"#08ffff",
                    borderWidth: 1,
                    borderRadius: 12
                }
            ],
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: "#e3daff" }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) =>
                            ctx.dataset.label + ": ₹ " + new Intl.NumberFormat('en-IN').format(ctx.raw)
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: "#ccc" },
                    grid: { color: "#396043" }
                },
                y: {
                     callback: (value) => new Intl.NumberFormat('en-IN').format(value),
                    ticks: { color: "#ccc" },
                    grid: { color: "#396043" }
                }
            }

        }

    }, [records])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="container mx-auto px-4 py-6 max-w-[1600px]">
                {/*Product Cards*/}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {productData.map((p, index) => (
                        <div key={index} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 rounded-2xl border border-cyan-400/20 shadow-lg backdrop-blur hover:scale-[1.03] transition">

                            {/* HEADER */}
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-white font-semibold text-lg">
                                    {p.name}
                                </h2>
                                <span className="text-xs text-white bg-lime-500/50 border border-lime-300/50  rounded-2xl p-1 px-2">
                                    {p.opportunities} deals
                                </span>
                            </div>

                            {/* FORECAST */}
                            <h1 className="text-2xl font-bol text-cyan-400 mb-3">
                                ₹{formatCurrency(p.forecast)}
                            </h1>

                            {/* PROGRESS BAR */}
                            <div className="w-full bg-gray-700 h-2 rounded-full mb-3">
                                <div
                                    className="bg-cyan-400 h-2 rounded-full"
                                    style={{ width: `${p.progress.toFixed(1)}%` }}
                                ></div>
                            </div>

                            {/* STATS */}
                            <div className="flex justify-between text-lg text-green-400 mb-2">
                                <span>Potential</span>
                                <span>₹{formatCurrency(p.potential)}</span>
                            </div>

                            <div className="flex justify-between text-sm text-gray-300 mb-3">
                                <span>Avg Deal</span>
                                <span>₹{formatCurrency(Math.round(p.avgDeal))}</span>
                            </div>

                            <div className="flex justify-between text-sm text-gray-300">
                                <span>Win Rate</span>
                                <span>{p.winRate.toFixed(1)}%</span>
                            </div>
                            {/* PIPELINE STAGES */}
                            <div className="flex flex-wrap gap-2 mb-3  mt-3">
                                {Object.entries(p.stages).map(([stage, count], i) => {

                                    const colors = {
                                        Prospecting: "bg-blue-500/20 text-blue-400 border border-blue-500/40",
                                        DemoRequest: "bg-teal-500/20 text-teal-400 border border-teal-500/40",
                                        DemoOn: "bg-purple-500/20 text-purple-400 border border-purple-500/40",
                                        DemoCompleted: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40",
                                        Quoted: "bg-amber-500/20 text-amber-400 border border-amber-500/40",
                                        Quote: "bg-orange-500/20 text-orange-400 border border-orange-500/40",
                                        Negotiation: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40",
                                        Ordered: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40",
                                        Delivered: "bg-green-500/20 text-green-400 border border-green-500/40",
                                        Lost: "bg-red-500/20 text-red-400 border border-red-500/40",

                                    };

                                    return (
                                        <span
                                            key={i}
                                            className={`px-3 py-1 text-xs rounded-full ${colors[stage] || colors["Unknown"]}`}
                                        >
                                            {stage} : {count}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>


                    ))}


                </div>
                {/*End of Product Cards*/}

                {/*Product Analysis Bar Chart */}

                <div className="bg-gray-800/30 rounded-2xl border border-gray-700 p-6 mb-6 ">
                    <h2 className="text-xl font-bold text-gray-200 mb-4">
                       <i className="fas fa-chart-bar me-1"></i> Product Analysis
                    </h2>
                    <div className="h-[400px]">
                        <Bar data={barData} options={barData} />
                    </div>
                </div>

                {/* End of Product Analysis Bar Chart */}
                {/*Product Forecast Details */}
                <div>
                    <h2 className="text-xl font-bold text-gray-200 mb-4"><i className="fas fa-table"></i> Product Forecast Details</h2>
                    <div className="bg-gray-800/30 rounded-2xl border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">

                            <table className="w-full">
                                <thead className="bg-gray-800 border-b border-gray-700">
                                    <tr>
                                        {["Product", "Total Opportunities", "Total Potential Value", "Weighted Forecast", "Average Deal Size", "Win Rate",].map((header) => (
                                            <th key={header} className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {productData.map((p, index) => (
                                        <tr key={index} className="border-b border-gray-700/50 text-center">

                                            <td className="px-6 py-4 text-gray-300">{p.name}</td>

                                            <td className="px-6 py-4 text-gray-300">{p.opportunities}</td>

                                            <td className="px-6 py-4 text-green-400">
                                                ₹{formatCurrency(p.potential)}
                                            </td>

                                            <td className="px-6 py-4 text-blue-400">
                                                ₹{formatCurrency(p.forecast)}
                                            </td>

                                            <td className="px-6 py-4 text-yellow-400">
                                                ₹{formatCurrency((p.avgDeal))}
                                            </td>

                                            <td className="px-6 py-4 text-purple-400">
                                                {p.winRate.toFixed(1)}%
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/*End Product Forecast Details */}

            </div>
        </div>
    )
}