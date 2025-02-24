import React, { useEffect, useState } from "react";
import { getNoteFrequency } from "../../utils/api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

interface NoteFrequencyChartProps {
  startDate: string;
  endDate: string;
}

const NoteFrequencyChart: React.FC<NoteFrequencyChartProps> = ({ startDate, endDate }) => {
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: "Заметок",
        data: [] as number[],
        borderColor: "rgb(255, 119, 0)",
        backgroundColor: "rgba(255, 153, 0, 0.69)",
        fill: true,
      },
    ],
  });

  const formatDateRU = (date: string) => date.split("-").reverse().join(".");

  useEffect(() => {
    const fetchNoteFrequency = async () => {
      try {
        const data = await getNoteFrequency(startDate, endDate);
        console.log(`data of note frequency: ${JSON.stringify(data)}`)

        setChartData({
          labels: data.data.map((entry: any) => formatDateRU(entry.date)),
          datasets: [
            {
              label: "Заметок",
              data: data.data.map((entry: any) => entry.count),
              borderColor: "rgb(255, 119, 0)",
              backgroundColor: "rgba(255, 153, 0, 0.69)",
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching note frequency data:", error);
      }
    };

    fetchNoteFrequency();
  }, [startDate, endDate]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold text-center mb-4">Частота ведения заметок</h2>
      <Line
        data={chartData}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
        }}
      />
    </div>
  );
};

export default NoteFrequencyChart;