import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("/eve.json");
      const jsonLines = result.data
        .split("\n")
        .filter((line) => line.trim() !== "");
      const parsedData = jsonLines.map((line) => JSON.parse(line));
      setData(parsedData);
    };
    fetchData();
  }, []);

  const processData = (data) => {
    const filteredData = data.filter((item) => typeof item.alert === "object");

    const timestamps = filteredData.map((item) => new Date(item.timestamp));
    const srcIps = filteredData.map((item) => item.src_ip);
    const destPorts = filteredData.map((item) => item.dest_port);
    const severities = filteredData.map((item) => item.alert.severity);
    const categories = filteredData.map((item) => item.alert.category);

    return { timestamps, srcIps, destPorts, severities, categories };
  };

  const { timestamps, srcIps, destPorts, severities, categories } =
    processData(data);

  const timeSeriesData = timestamps.reduce((acc, time) => {
    acc[time] = (acc[time] || 0) + 1;
    return acc;
  }, {});
  const timeSeriesPlot = {
    x: Object.keys(timeSeriesData),
    y: Object.values(timeSeriesData),
    type: "scatter",
    mode: "lines+markers",
    marker: { color: "green" },
  };

  const srcIpData = srcIps.reduce((acc, ip) => {
    acc[ip] = (acc[ip] || 0) + 1;
    return acc;
  }, {});
  const srcIpPlot = {
    x: Object.keys(srcIpData).slice(0, 10),
    y: Object.values(srcIpData).slice(0, 10),
    type: "bar",
    marker: { color: "green" },
  };

  const destPortData = destPorts.reduce((acc, port) => {
    acc[port] = (acc[port] || 0) + 1;
    return acc;
  }, {});
  const destPortPlot = {
    x: Object.keys(destPortData).slice(0, 10),
    y: Object.values(destPortData).slice(0, 10),
    type: "bar",
    marker: { color: "green" },
  };

  const severityData = severities.reduce((acc, severity) => {
    acc[severity] = (acc[severity] || 0) + 1;
    return acc;
  }, {});
  const severityPlot = {
    x: Object.keys(severityData),
    y: Object.values(severityData),
    type: "bar",
    marker: { color: "green" },
  };

  const categoryData = categories.reduce((acc, category) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  const categoryPlot = {
    labels: Object.keys(categoryData),
    values: Object.values(categoryData),
    type: "pie",
  };

  return (
    <>
      <div className="App">
        <h1>Network Traffic Analysis</h1>
      </div>
      <div className="dashboard">
        <div className="graph-container">
          <div className="graph-title">Time Series of Alerts</div>
          <Plot
            data={[timeSeriesPlot]}
            layout={{
              title: "",
              paper_bgcolor: "rgba(0,0,0,11.0%)",
              plot_bgcolor: "rgba(0,0,0,0)",
              font: { color: "white" },
              autosize: true,
            }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className="graph-container">
          <div className="graph-title">
            Top 10 Source IPs by Number of Alerts
          </div>
          <Plot
            data={[srcIpPlot]}
            layout={{
              title: "",
              paper_bgcolor: "rgba(0,0,0,11.0%)",
              plot_bgcolor: "rgba(0,0,0,0)",
              font: { color: "white" },
              autosize: true,
            }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className="graph-container">
          <div className="graph-title">
            Top 10 Destination Ports by Number of Alerts
          </div>
          <Plot
            data={[destPortPlot]}
            layout={{
              title: "",
              paper_bgcolor: "rgba(0,0,0,11.0%)",
              plot_bgcolor: "rgba(0,0,0,0)",
              font: { color: "white" },
              autosize: true,
            }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className="graph-container">
          <div className="graph-title">Alert Severity Distribution</div>
          <Plot
            data={[severityPlot]}
            layout={{
              title: "",
              paper_bgcolor: "rgba(0,0,0,11.0%)",
              plot_bgcolor: "rgba(0,0,0,0)",
              font: { color: "white" },
              autosize: true,
            }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className="graph-container">
          <div className="graph-title">Alert Categories Distribution</div>
          <Plot
            data={[categoryPlot]}
            layout={{
              title: "",
              paper_bgcolor: "rgba(0,0,0,11.0%)",
              plot_bgcolor: "rgba(0,0,0,0)",
              font: { color: "white" },
              autosize: true,
            }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
