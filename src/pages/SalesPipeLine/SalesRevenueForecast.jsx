import axios from "axios";
import { useEffect, useState } from "react"
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement,Filler);

export default function RevenueForecast() {
    const API=import.meta.env.VITE_BACKEND_URL;
    const [records, setRecords] = useState([]);
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            currency: 'INR',
            maximumFractionDigits: 3
        }).format(amount);
    }

    function formatMonth(monthStr) {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
 
    useEffect(() => {
        axios.get(`${API}/api/records`)
            .then(res => setRecords(res.data))
            .catch(err => console.error(err))
    }, [])
   
    {/*MONTHLY FORECAST */ }
    const monthlyMap = {};
    records.forEach(r => {
        const month = r.forecastMonth || "Unknown";

        if (!monthlyMap[month]) {
            monthlyMap[month] = {
                value: 0,
                count: 0
            };
        }
        monthlyMap[month].value += r.weightedForecast || 0;
        monthlyMap[month].count += 1;
    });
    const monthlyData = Object.entries(monthlyMap).map(([month, data]) => ({
        month,
        value: data.value,
        count: data.count
    }));
    {/*END OF MONTHLY FORECAST */ }

    {/*QUARTERLY FORECAST */ }
    const getQuarter = (month) => {
        if (!month) return "Unknown";
        const m = new Date(month).getMonth() + 1;

        if (m <= 3) return "Q1";
        if (m <= 6) return "Q2";
        if (m <= 9) return "Q3";
        return "Q4";
    };

    const quarterlyMap = {};

    records.forEach(r => {
        const q = getQuarter(r.forecastMonth);

        if (!quarterlyMap[q]) {
            quarterlyMap[q] = { value: 0, count: 0 };
        }

        quarterlyMap[q].value += r.weightedForecast || 0;
        quarterlyMap[q].count += 1;
    });

    const quarterlyData = Object.entries(quarterlyMap).map(([q, data]) => ({
        quarter: q,
        value: data.value,
        count: data.count
    }));
    {/* END QUARTERLY FORECAST */ }
    {/*YEARLY FORECAST */ }
    const yearlyMap = {};

    records.forEach(r => {
        const year = r.forecastMonth
            ? new Date(r.forecastMonth).getFullYear()
            : "Unknown";

        if (!yearlyMap[year]) {
            yearlyMap[year] = { value: 0, count: 0 };
        }

        yearlyMap[year].value += r.weightedForecast || 0;
        yearlyMap[year].count += 1;
    });

    const yearlyData = Object.entries(yearlyMap).map(([year, data]) => ({
        year,
        value: data.value,
        count: data.count
    }));
    {/*END OF YEARLY FORECAST */ }

    const monthlyTotal = monthlyData.reduce((sum, n) => sum + n.value, 0);
    const quarterlyTotal = quarterlyData.reduce((sum, n) => sum + n.value, 0);
    const yearlyTotal = yearlyData.reduce((sum, n) => sum + n.value, 0);

    const monthlyCount = monthlyData.reduce((sum, n) => sum + n.count, 0);
    const quarterlyCount = quarterlyData.reduce((sum, n) => sum + n.count, 0);
    const yearlyCount = yearlyData.reduce((sum, n) => sum + n.count, 0);

    const trendData = {
        labels: monthlyData.map(m => formatMonth(m.month)),
        datasets: [
            {
                label: "Forecast Trend",
                data: monthlyData.map(m => m.value),
                backgroundColor:"#ff24ed25",
                borderColor:"#ed0cbc",
                fill:true,
                borderRadius:3
            }
        ],
        responsive: true,
            maintainAspectRatio: false,
            animations: {
                tension: {
                    duration: 1000,
                    easing: 'easeOut',
                    from: 0,
                    to: 0.5,
                    loop: true
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: "#e5e7eb"
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            return context.dataset.label + ": ₹ " + formatCurrency(context.raw);
                        }
                    }
                },
            },
            scales: {
                x: {
                    grid: { color: "#00c8ff6f" },
                    ticks: { color: "#9ca3af" }
                },
                y: {
                    grid: { color: "#1de5ff50" },
                    ticks: { color: "#9ca3af" },
                    callback: (value) => formatCurrency(value)
                }
            }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-6">

            {/* 🔥 GRID LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {/* 🔵 MONTHLY */}
                <div className="bg-slate-800/60 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition">

                    <h3 className="text-cyan-400 text-lg font-semibold mb-4">
                        <i className="fas fa-calendar-week mr-2"></i> Monthly Forecast
                    </h3>

                    <h1 className="text-3xl font-bold text-white mb-4">
                        ₹{formatCurrency(monthlyTotal)}
                    </h1>

                    {/* PROGRESS */}
                    <div className="w-full bg-gray-700 h-2 rounded-full mb-2">
                        <div
                            className="bg-cyan-400 h-2 rounded-full"
                            style={{ width: `65%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-400 mb-4">
                        <span>Pipeline based</span>
                        <span>{monthlyCount} deals</span>
                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-300">
                            <thead className="text-gray-400 border-b border-gray-700">
                                <tr>
                                    <th className="text-left py-2">Month</th>
                                    <th className="text-left py-2">Value</th>
                                    <th className="text-left py-2">Deals</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthlyData.map((m, i) => (
                                    <tr key={i} className="border-b border-gray-700 hover:bg-white/5">
                                        <td className="py-2">{formatMonth(m.month)}</td>
                                        <td>₹{formatCurrency(m.value)}</td>
                                        <td>{m.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 🟣 QUARTERLY */}
                <div className="bg-slate-800/60 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition">

                    <h3 className="text-purple-400 text-lg font-semibold mb-4">
                        <i className="fas fa-chart-pie mr-2"></i> Quarterly Forecast
                    </h3>

                    <h1 className="text-3xl font-bold text-white mb-4">
                        ₹{formatCurrency(quarterlyTotal)}
                    </h1>

                    <div className="w-full bg-gray-700 h-2 rounded-full mb-2">
                        <div
                            className="bg-purple-400 h-2 rounded-full"
                            style={{ width: `45%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-400 mb-4">
                        <span>Pipeline based</span>
                        <span>{quarterlyCount} deals</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-300">
                            <thead className="text-gray-400 border-b border-gray-700">
                                <tr>
                                    <th className="py-2 text-left">Quarter</th>
                                    <th className="py-2 text-left">Value</th>
                                    <th className="py-2 text-left">Deals</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quarterlyData.map((q, i) => (
                                    <tr key={i} className="border-b border-gray-700 hover:bg-white/5">
                                        <td className="py-2">{q.quarter}</td>
                                        <td>₹{formatCurrency(q.value)}</td>
                                        <td>{q.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 🟢 YEARLY */}
                <div className="bg-slate-800/60 backdrop-blur-xl border border-green-400/20 rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition">

                    <h3 className="text-green-400 text-lg font-semibold mb-4">
                        <i className="fas fa-chart-bar mr-2"></i> Annual Forecast
                    </h3>

                    <h1 className="text-3xl font-bold text-white mb-4">
                        ₹{formatCurrency(yearlyTotal)}
                    </h1>

                    <div className="w-full bg-gray-700 h-2 rounded-full mb-2">
                        <div
                            className="bg-green-400 h-2 rounded-full"
                            style={{ width: "30%" }}
                        ></div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-400 mb-4">
                        <span>Total pipeline</span>
                        <span>{yearlyCount} deals</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-300">
                            <thead className="text-gray-400 border-b border-gray-700">
                                <tr>
                                    <th className="py-2 text-left">Year</th>
                                    <th className="py-2 text-left">Value</th>
                                    <th className="py-2 text-left">Deals</th>
                                </tr>
                            </thead>
                            <tbody>
                                {yearlyData.map((y, i) => (
                                    <tr key={i} className="border-b border-gray-700 hover:bg-white/5">
                                        <td className="py-2">{y.year}</td>
                                        <td>₹{formatCurrency(y.value)}</td>
                                        <td>{y.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* 📊 TREND SECTION */}
            <div className="mt-8 bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
                <h3 className="text-white text-lg font-semibold mb-4">
                    <i className="fas fa-chart-line mr-2"></i> Forecast Trend Analysis
                </h3>

                <div className="h-[400px] flex items-center justify-center text-gray-400">
                    <Line data={trendData} options={trendData}></Line>
                </div>
            </div>

        </div>
    )
}