import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/entities")
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  if (!data.length) return <p>Loading...</p>;

  const clusters = [...new Set(data.map(d => d.entity_cluster))];
  const clusterCounts = clusters.map(c => {
    const arr = data.filter(d => d.entity_cluster == c)
                    .map(d => Number(d.entity_count));
    return arr.reduce((a,b)=>a+b,0) / arr.length;
  });

  const chartData = {
    labels: clusters.map(c => `Cluster ${c}`),
    datasets: [{
      label: "Entity 平均數",
      data: clusterCounts,
      backgroundColor: "rgba(54, 162, 235, 0.5)",
    }],
  };

  return (
    <div style={{ width: "600px", margin: "50px auto" }}>
      <h1>4G 吃到飽分析結果</h1>
      <Bar data={chartData} />
      <h2>前 10 名文章</h2>
      <ul>
        {data.slice(0,10).map(d => (
          <li key={d.排名}>
            <a href={d.連結} target="_blank">{d.標題}</a> - 字數: {d.文章內容.length}
          </li>
        ))}
      </ul>
    </div>
  );
}
