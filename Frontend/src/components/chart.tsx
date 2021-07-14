import { useTheme } from "@material-ui/core/styles";
import React from "react";
import { Line } from "react-chartjs-2";

interface Props {
  rank: number;
  answers: number;
  attempts: number;
}

const Chart: React.FC<Props> = ({ rank, answers, attempts }) => {
  const theme = useTheme();
  const state = {
    labels: ["Rank", "Correct Answers", "Attempts"],
    datasets: [
      {
        label: "value",
        fontColor: theme.palette.type === "dark" ? "white" : "black",
        fill: false,
        lineTension: 0.5,
        backgroundColor: "white",
        borderColor: "#1a1919",
        borderWidth: 2,
        data: [rank, answers, attempts],
      },
    ],
  };

  return (
    <div>
      <Line
        data={state}
        options={{
          title: {
            display: true,
            text: "STATISTICS",
            fontSize: 20,
            fontColor: theme.palette.type === "dark" ? "white" : "black",
          },
          legend: {
            display: false,
            position: "right",
            labels: {
              fontColor: theme.palette.type === "dark" ? "white" : "black",
              fontSize: 14,
            },
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  suggestedMin: 0,
                  fontColor: theme.palette.type === "dark" ? "white" : "black",
                },
              },
            ],
            xAxes: [
              {
                ticks: {
                  fontColor: theme.palette.type === "dark" ? "white" : "black",
                },
              },
            ],
          },
        }}
      />
    </div>
  );
};

export default Chart;
