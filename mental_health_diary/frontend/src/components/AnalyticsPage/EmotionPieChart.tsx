import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getEmotionAnalysis } from "../../utils/api";

ChartJS.register(ArcElement, Tooltip, Legend);

const EmotionPieChart: React.FC<{ type: "Позитивные эмоции" | "Негативные эмоции", startDate: string, endDate: string }> = ({ type, startDate, endDate }) => {
    const [chartData, setChartData] = useState<any>({
        labels: [],
        datasets: [],
    });
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getEmotionAnalysis(type, startDate, endDate);
                console.log(`Emotions data: ${JSON.stringify(data)}`);

                setChartData({
                    labels: data.data.map((entry: any) => entry.emotion_name),
                    datasets: data.data.length > 0 ? [
                        {
                            data: data.data.map((entry: any) => entry.count),
                            backgroundColor: data.data.map((entry: any) => entry.emotion_color || "#FFA500"),
                        },
                    ] : [],
                });
            } catch (error) {
                console.error("Error fetching emotion analysis data:", error);
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
            <h2 className="text-lg font-semibold text-center mb-4">{type}</h2>
            <Pie data={chartData} />
        </div>
    );
};

export default EmotionPieChart;