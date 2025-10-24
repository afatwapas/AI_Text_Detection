import React, { useState } from "react";
import "./App.css";
import { API_URL } from "./config"; // Import API URL

function App() {
  const [text, setText] = useState("");
  const [prediction, setPrediction] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    if (!text) return;
    
    // Clear existing result and show loading state
    setPrediction("");
    setIsLoading(true);
    
    try {
      const response = await fetch(API_URL, {  // Use imported API URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPrediction("Error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={darkMode ? "App dark" : "App"}>
      <div className="top-bar">
        <label className="switch">
          <span className="mode-text">Light</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span className="slider round"></span>
          <span className="mode-text">Dark</span>
        </label>
      </div>

      <div className="container">
        <h1>AI vs Human Text Detector</h1>
        <textarea
          placeholder="Paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="predict-btn" onClick={handlePredict} disabled={isLoading}>
          {isLoading ? "Predicting..." : "Predict"}
        </button>
        {prediction && <h2 className="result">Prediction: {prediction}</h2>}
      </div>
    </div>
  );
}

export default App;