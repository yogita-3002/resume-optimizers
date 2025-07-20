import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';

function App() {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState("General");
  const [response, setResponse] = useState("");
  const [chartData, setChartData] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_role", jobRole);

    try {
      const res = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        setResponse(err.error || "Upload failed.");
        return;
      }

      const data = await res.json();
      const found = data.analysis?.found_keywords || [];
      const missing = data.analysis?.missing_keywords || [];
      const words = data.analysis?.total_words ?? "N/A";
      const score = data.analysis?.match_score ?? 0;
      const suggestions = data.suggestions || "";

      setChartData([
        { name: "Found Skills", count: found.length },
        { name: "Missing Skills", count: missing.length },
        { name: "Match Score", count: score },
      ]);

      const formatted = `
📄 Resume Text:
${data.text}

✅ Found Skills: ${found.join(", ") || "None"}
❌ Missing Skills: ${missing.join(", ") || "None"}
📝 Total Words: ${words}
📊 Match Score: ${score}%

💡 AI Suggestions:
${suggestions}
      `;
      setResponse(formatted.trim());
    } catch (err) {
      console.error(err);
      setResponse("Failed to upload.");
    }
  };

  const handleDownload = () => {
    if (!response) {
      alert("No response to download yet!");
      return;
    }

    const blob = new Blob([response], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "resume_report.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Resume Optimizer</h2>

      <label>Choose Job Role: </label>
      <select onChange={(e) => setJobRole(e.target.value)} value={jobRole} style={{ marginBottom: "10px" }}>
        <option value="General">General</option>
        <option value="Frontend Developer">Frontend Developer</option>
        <option value="Backend Developer">Backend Developer</option>
        <option value="Full Stack Developer">Full Stack Developer</option>
        <option value="Data Analyst">Data Analyst</option>
        <option value="Machine Learning Engineer">Machine Learning Engineer</option>
        <option value="DevOps Engineer">DevOps Engineer</option>
      </select>

      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
          Upload Resume
        </button>
        <button onClick={handleDownload} style={{ marginLeft: "10px" }}>
          Download Report
        </button>
      </div>

      <pre style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>{response}</pre>

      {chartData && (
        <div style={{ marginTop: "40px", height: "300px" }}>
          <h3>Skill Analysis Chart</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default App;
