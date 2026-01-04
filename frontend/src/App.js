import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "https://vehicle-damage-assessment.onrender.com/predict",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(res.data);
    } catch (err) {
      setError("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>🚗 Vehicle Damage Detection</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload} style={styles.button}>
        Detect Damage
      </button>

      {loading && <p>Processing image...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={styles.resultBox}>
          <h3>Detection Results</h3>

          {result.detections.length === 0 && <p>No damage detected</p>}

          {result.detections.map((d, i) => (
            <p key={i}>
              <b>{d.class}</b> — {(d.confidence * 100).toFixed(2)}%
            </p>
          ))}

          {result.image_base64 && (
            <div style={{ marginTop: "20px" }}>
              <h3>Detection Image</h3>
              <img
                src={`data:image/jpeg;base64,${result.image_base64}`}
                alt="Detection Result"
                style={{ width: "100%", borderRadius: "10px" }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    fontFamily: "Arial",
    maxWidth: "600px",
    margin: "auto",
    textAlign: "center",
  },
  button: {
    marginTop: "15px",
    padding: "10px 25px",
    fontSize: "16px",
    cursor: "pointer",
  },
  resultBox: {
    marginTop: "25px",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "10px",
  },
};

export default App;
