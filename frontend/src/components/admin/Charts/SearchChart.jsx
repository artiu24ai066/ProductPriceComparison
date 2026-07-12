import "./SearchChart.css";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

const data = [
    { day: "Mon", searches: 420 },
    { day: "Tue", searches: 680 },
    { day: "Wed", searches: 590 },
    { day: "Thu", searches: 910 },
    { day: "Fri", searches: 840 },
    { day: "Sat", searches: 1180 },
    { day: "Sun", searches: 980 },
];

const SearchChart = () => {
    return (
        <div className="search-chart">

            <div className="chart-header">

                <div>
                    <h2>Search Trends</h2>
                    <p>Last 7 Days</p>
                </div>

            </div>

            <div className="chart-wrapper">

                <ResponsiveContainer width="100%" height="100%">

                    <AreaChart data={data}>

                        <defs>

                            <linearGradient
                                id="searchGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >

                                <stop offset="0%" stopColor="#4F8CFF" stopOpacity={0.45} />

                                <stop offset="100%" stopColor="#4F8CFF" stopOpacity={0} />

                            </linearGradient>

                        </defs>

                        <CartesianGrid
                            strokeDasharray="4 4"
                            stroke="#2B3340"
                        />

                        <XAxis
                            dataKey="day"
                            tick={{ fill: "#9BA4B5" }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
                            tick={{ fill: "#9BA4B5" }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <Tooltip />

                        <Area
                            type="monotone"
                            dataKey="searches"
                            stroke="#4F8CFF"
                            strokeWidth={3}
                            fill="url(#searchGradient)"
                        />

                    </AreaChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
};

export default SearchChart;