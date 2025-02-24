import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { getMoodTrends } from "../../utils/api";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const MoodTrendsChart: React.FC<{ type: "mood_trends" | "energy_trends", startDate: string, endDate: string }> = ({ type, startDate, endDate }) => {
    const [chartData, setChartData] = useState<any>({
        labels: [],
        datasets: [],
    });
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getMoodTrends(startDate, endDate);
                console.log(`Mood trends data: ${JSON.stringify(data)}`);

                const datasetKey = type === "mood_trends" ? "moodTrends" : "energyTrends";
                const dataset = data[datasetKey] || [];

                setChartData({
                    labels: dataset.map((entry: any) => entry.mood__mood_name || entry.emotions__emotion_name),
                    datasets: dataset.length > 0 ? [
                        {
                            label: "Количество",
                            data: dataset.map((entry: any) => entry.count),
                            backgroundColor: dataset.map((entry: any) => entry.mood__color || entry.emotions__color || "#FFA500"),
                        },
                    ] : [],
                });
            } catch (error) {
                console.error("Error fetching mood trends data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [type, startDate, endDate]);

    if (loading) return <div>Loading...</div>;
    if (!chartData || !chartData.datasets || chartData.datasets.length === 0) return <div>No data available</div>;

    return (
        <div className="w-full max-w-2xl mx-auto bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold text-center mb-4">
                {type === "mood_trends" ? "Тренды настроения" : "Уровень энергии"}
            </h2>
            <Bar data={chartData} options={{ plugins: { legend: { display: false } } }} />
        </div>
    );
};

export default MoodTrendsChart;