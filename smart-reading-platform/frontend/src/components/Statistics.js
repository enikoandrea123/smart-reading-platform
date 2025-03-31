import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import "./Statistics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const Statistics = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchStats();

        return () => {
            if (window.Chart) {
                window.Chart.helpers.each(window.Chart.instances, function (chart) {
                    chart.destroy();
                });
            }
        };
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/admin/statistics", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch statistics");
            }

            const data = await response.json();
            setStats(data);
        } catch (error) {
            setError(error.message);
        }
    };

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!stats) return <p>Loading statistics...</p>;

    const activeUsersData = {
        labels: stats.active_users_by_day.map(item => item.date),
        datasets: [
            {
                label: "Active Users (Last 30 Days)",
                data: stats.active_users_by_day.map(item => item.count),
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                fill: true,
            },
        ],
    };

    const bookStatsData = {
        labels: ["Total Users", "Total Favorites", "Total Reading List"],
        datasets: [
            {
                data: [
                    stats.total_users,
                    stats.total_favorites,
                    stats.total_reading_list
                ],
                backgroundColor: "rgba(255,159,64,0.8)",
            },
        ],
    };

    return (
        <div className="admin-statistics">
            <h2>📊 Platform Statistics</h2>
            <div className="stat-grid">
                <div className="stat-card">👤 Total Users: {stats.total_users}</div>
                <div className="stat-card">📚 Total Books Favorited: {stats.total_favorites}</div>
                <div className="stat-card">📖 Books in Reading Lists: {stats.total_reading_list}</div>
                <div className="stat-card">🔥 Active Users (Last 30 Days): {stats.active_users}</div>
            </div>

            <div className="charts">
                <h3>Active Users Over Last 30 Days</h3>
                <div className="chart-container">
                    <Line data={activeUsersData} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>

                <h3>Platform Stats</h3>
                <div className="chart-container">
                    <Bar data={bookStatsData} options={{ responsive: true, maintainAspectRatio: true }}  />
                </div>
            </div>
        </div>
    );
};

export default Statistics;