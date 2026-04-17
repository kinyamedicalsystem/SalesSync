import axios from "axios";
import { useEffect, useState, useMemo } from "react"
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement
} from "chart.js";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement
);

ChartJS.register(ArcElement, Tooltip, Legend);
import { Pie, Bar, Line } from "react-chartjs-2";

export default function Dashboard() {
    const [records, setRecords] = useState([]);

    const formatCurrency = (num) => {
        return new Intl.NumberFormat('en-IN').format(num);
    }
    function formatMonth(monthStr) {
        const [year, month] = monthStr.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    useEffect(() => {
        axios.get("http://localhost:8085/api/records")
            .then(res => setRecords(res.data))
            .catch(err => console.log(err));
    }, []);


    const stageColors = {
        Prospecting: "#0959e4",
        DemoRequest: "#08f3a9",
        DemoOn: "#ca09e4",
        DemoCompleted: "#0dfffb",
        Quoted: "#c1ff06",
        Quote: "#ffb300",
        Negotiation: "#f1ff2c",
        Ordered: "#0aaf36",
        Delivered: "#1aff0a",
        Lost: "#e40909",
    };

    const pieData = useMemo(() => {
        const stageData = {};

        records.forEach(r => {
            const stage = r.pipelineStage || "Unknown";
            stageData[stage] = (stageData[stage] || 0) + 1;
        });
        const labels = Object.keys(stageData);   // ✅ FIX
        const data = Object.values(stageData);   // ✅ CLEAN
        return {
            labels,
            datasets: [{
                data,
                backgroundColor: labels.map(l => stageColors[l] || "#0959e4"),
                borderWidth: 1,
                borderColor: "#54575e"
            }],

            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "right",
                    labels: {
                        color: "#e5e7eb",
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            cutout: "60%",
            // makes doughnut style 🔥
        }

    }, [records])

    const hospitalBar = useMemo(() => {
        const hospitalData = {};

        records.forEach(r => {
            const h = r.hospitalName.toLowerCase() || "Unknown";
            hospitalData[h] = (hospitalData[h] || 0) + (r.potentialValue || 0);
     
        });
        return {
            labels: Object.keys(hospitalData),
            datasets: [{
                label: "Hospital",
                data: Object.values(hospitalData),
                backgroundColor: "#7700ffb3",
                borderColor: "#923bf6",
                borderWidth: 1,
                borderRadius: 1,
            }],
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: "#e5e7eb"

                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            return "₹ " + formatCurrency(context.raw);
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: "#9ca3af" },
                    grid: { color: "rgba(255, 255, 255, 0.1)" },
                    callback: (value) => formatCurrency(value)
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: "#9ca3af" },
                    grid: { color: "rgba(255, 255, 255, 0.18)" }
                }
            },
            indexAxis: 'y'
        }
    }, [records])

    const forecastLine = useMemo(() => {
        const trend = {};
        const potential = {};

        records.forEach(r => {
            const month = r.forecastMonth || "Unknown";
            trend[month] = (trend[month] || 0) + (r.weightedForecast || 0);
            potential[month] = (potential[month] || 0) + (r.potentialValue || 0);
        });
        const sortedMonths = Object.keys(trend)
            .sort((a, b) => new Date(a) - new Date(b)); // ✅ important

        const labels = sortedMonths.map(month => formatMonth(month));
        return {
            labels,
            datasets: [{
                label: "Weighted Forecast",
                data: Object.values(trend),
                backgroundColor: "#ff00ea53",
                borderColor: "#f505c9fb",
                fill: true,
                borderRadius: 6,
            },
            {
                label: "Potential Value",
                data: Object.values(potential),
                backgroundColor: "#1ccebf46",
                borderColor: "#1ccebf",
                fill: true,
                borderRadius: 6
            }],
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
                    grid: { color: "#8191ac" },
                    ticks: { color: "#9ca3af" }
                },
                y: {
                    grid: { color: "#444850" },
                    ticks: { color: "#9ca3af" },
                    callback: (value) => formatCurrency(value)
                }
            }
        }

    }, [records])



    const doctorBar = useMemo(() => {
        const doctorData = {};

        records.forEach(r => {
            const d = r.drName.toLowerCase() || "Unknown";
            doctorData[d] = (doctorData[d] || 0) + (r.potentialValue || 0);
        });
        return {
            labels: Object.keys(doctorData),
            datasets: [{
                label: "potential Value",
                data: Object.values(doctorData),
                backgroundColor: "#24f02149",
                borderColor: "#24f021",
                borderWidth: 1,
                borderRadius: 6,
            }],
            responsive: true,
            maintainAspectRatio: false,
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
                }
            },
            scales: {
                x: {
                    ticks: { color: "#9ca3af" },
                    grid: { color: "rgba(255,255,255,0.18)" }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: "#9ca3af" },
                    grid: { color: "rgba(255, 255, 255, 0.18)" }
                }
            },
        }

    }, [records])


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="container mx-auto px-4 py-6 max-w-[1600px]">
                {/* KPIS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
                    {/* TOTAL */}
                    <div className="group bg-gradient-to-br from-cyan-500/20 to-blue-500/10 p-6 rounded-2xl border border-cyan-400/20 backdrop-blur-lg shadow-lg hover:scale-105 transition duration-300">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm text-gray-300">Total Records</h3>
                            <i className="fa-solid fa-database text-cyan-400 text-xl"></i>
                        </div>
                        <h1 className="text-3xl font-bold text-white mt-3">
                            {records.length}
                        </h1>
                    </div>

                    {/* REVENUE */}
                    <div className="group bg-gradient-to-br from-green-500/20 to-emerald-500/10 p-6 rounded-2xl border border-green-400/20 backdrop-blur-lg shadow-lg hover:scale-105 transition duration-300">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm text-gray-300">Revenue</h3>
                            <i className="fa-solid fa-indian-rupee-sign text-green-400 text-xl"></i>
                        </div>
                        <h1 className="text-3xl font-bold text-white mt-3">
                            ₹ {useMemo(() => formatCurrency(records.reduce((sum, r) => sum + (r.potentialValue || 0), 0)), [records])}
                        </h1>
                    </div>

                    {/* FORECAST */}
                    <div className="group bg-gradient-to-br from-purple-500/20 to-pink-500/10 p-6 rounded-2xl border border-purple-400/20 backdrop-blur-lg shadow-lg hover:scale-105 transition duration-300">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm text-gray-300">Forecast</h3>
                            <i className="fa-solid fa-chart-line text-purple-400 text-xl"></i>
                        </div>
                        <h1 className="text-3xl font-bold text-white mt-3">
                            ₹ {useMemo(() => formatCurrency(records.reduce((sum, r) => sum + (r.weightedForecast || 0), 0)), [records])}
                        </h1>
                    </div>

                    {/* WINNING % */}
                    <div className="group bg-gradient-to-br from-orange-500/20 to-yellow-500/10 p-6 rounded-2xl border border-orange-400/20 backdrop-blur-lg shadow-lg hover:scale-105 transition duration-300">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm text-gray-300">Winning %</h3>
                            <i className="fa-solid fa-trophy text-orange-400 text-xl"></i>
                        </div>
                        <h1 className="text-3xl font-bold text-white mt-3">
                            {useMemo(() => records.length > 0
                                ? (records.reduce((sum, r) => sum + (r.winningPercentage || 0), 0) / records.length).toFixed(2)
                                : 0, [records])}%
                        </h1>
                    </div>
                </div>
                {/* END OF THE KIPS */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                    {/* PIE */}
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-2xl border border-cyan-400/20 backdrop-blur-xl shadow-xl hover:shadow-cyan-500/20 transition hover:scale-[1.03] transition-all duration-300">
                        <h2 className="text-white text-lg font-semibold mb-4 ">
                            <i className="fas fa-chart-pie me-2"></i> Pipeline Stages
                        </h2>
                        <div className="h-72">
                            <Pie data={pieData} options={pieData} />
                        </div>
                    </div>

                    {/* HOSPITAL */}
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-2xl border border-blue-400/20 backdrop-blur-xl shadow-xl hover:shadow-blue-500/20 transition hover:scale-[1.03] transition-all duration-300">
                        <h2 className="text-white text-lg font-semibold mb-4">
                            <i className="fas fa-hospital me-2"></i> Hospital Distribution
                        </h2>
                        <div className="h-72">
                            <Bar data={hospitalBar} options={hospitalBar} />
                        </div>
                    </div>

                    {/* FORECAST */}
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-2xl border border-purple-400/20 backdrop-blur-xl shadow-xl hover:shadow-purple-500/20 transition hover:scale-[1.03] transition-all duration-300">
                        <h2 className="text-white text-lg font-semibold mb-4">
                            <i className="fas fa-chart-line me-2"></i>  Forecast Trend
                        </h2>
                        <div className="h-72">
                            <Line data={forecastLine} options={forecastLine} />
                        </div>
                    </div>

                    {/* DOCTOR */}
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-2xl border border-green-400/20 backdrop-blur-xl shadow-xl hover:shadow-green-500/20 transition hover:scale-[1.03] transition-all duration-300">
                        <h2 className="text-white text-lg font-semibold mb-4">
                            <i className="fas fa-user-md me-2"></i> Doctor Performance
                        </h2>
                        <div className="h-72">
                            <Bar data={doctorBar} options={doctorBar} />
                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
}