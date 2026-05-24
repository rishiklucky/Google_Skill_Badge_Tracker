import { useState, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import styles from "./VerifySheet.module.css";

const API = "/api";

const STATUS_CONFIG = {
  "Completed":     { bg: "var(--green-light)",  border: "#BBF7D0", text: "var(--green-dark)",  icon: "✅", bar: "var(--green)"  },
  "Not Completed": { bg: "var(--amber-light)",  border: "#FDE68A", text: "var(--amber-dark)",  icon: "⏳", bar: "var(--amber)"  },
  "Not Available": { bg: "var(--red-light)",    border: "#FECACA", text: "var(--red-dark)",    icon: "🚫", bar: "var(--red)"    },
};
const DEFAULT_CONFIG = { bg: "var(--bg)", border: "var(--border)", text: "var(--text-secondary)", icon: "📋", bar: "var(--text-muted)" };

function StatusCard({ label, count, total }) {
  const cfg = STATUS_CONFIG[label] || DEFAULT_CONFIG;
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className={styles.card} style={{ background: cfg.bg, borderColor: cfg.border }}>
      <div className={styles.cardTop}>
        <span className={styles.cardIcon}>{cfg.icon}</span>
        <span className={styles.cardCount} style={{ color: cfg.text }}>{count}</span>
      </div>
      <p className={styles.cardLabel} style={{ color: cfg.text }}>{label}</p>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${pct}%`, background: cfg.bar }} />
      </div>
      <p className={styles.cardPct} style={{ color: cfg.text }}>{pct}%</p>
    </div>
  );
}

export default function VerifySheet() {
  const [file, setFile]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [result, setResult]   = useState(null);

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) { setFile(accepted[0]); setError(""); setResult(null); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    onDrop,
  });

  const handleVerify = async () => {
    if (!file) { setError("Please upload your edited Excel sheet first."); return; }
    setError(""); setResult(null); setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await axios.post(`${API}/verify`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not read the file. Make sure it has a Completion Status column.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => { setFile(null); setResult(null); setError(""); };

  return (
    <div className={styles.wrapper}>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerIcon}>🔍</div>
        <div>
          <p className={styles.title}>Verify Edited Sheet</p>
          <p className={styles.subtitle}>
            Upload your manually edited sheet to recount each status value.
          </p>
        </div>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={[
          styles.dropzone,
          isDragActive ? styles.dropzoneActive : "",
          file ? styles.dropzoneFilled : "",
        ].join(" ")}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className={styles.fileRow}>
            <span className={styles.fileEmoji}>📄</span>
            <div className={styles.fileInfo}>
              <p className={styles.fileName}>{file.name}</p>
              <p className={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              type="button"
              className={styles.clearBtn}
              onClick={(e) => { e.stopPropagation(); handleClear(); }}
            >✕</button>
          </div>
        ) : (
          <div className={styles.dropContent}>
            <span className={styles.dropEmoji}>📂</span>
            <p className={styles.dropText}>
              {isDragActive ? "Drop it here…" : "Drag & drop your edited .xlsx here"}
            </p>
            <p className={styles.dropSub}>or click to browse</p>
          </div>
        )}
      </div>

      {error && (
        <div className={styles.errorBox} role="alert">⚠️ {error}</div>
      )}

      <button
        className={styles.verifyBtn}
        onClick={handleVerify}
        disabled={loading || !file}
      >
        {loading
          ? <><span className={styles.spinner} /> Analysing…</>
          : "🔍 Verify Sheet"}
      </button>

      {/* Results */}
      {result && (
        <div className={styles.results}>
          <div className={styles.resultsMeta}>
            <span className={styles.resultsTotal}>
              {result.total} rows analysed
            </span>
            <span className={styles.resultsBreakdown}>
              {result.breakdown.length} unique status{result.breakdown.length !== 1 ? "es" : ""}
            </span>
          </div>

          <div className={styles.cardsGrid}>
            {result.breakdown.map((item) => (
              <StatusCard key={item.label} label={item.label} count={item.count} total={result.total} />
            ))}
          </div>

          {result.breakdown.length === 0 && (
            <p className={styles.emptyNote}>No status values found in the Completion Status column.</p>
          )}
        </div>
      )}
    </div>
  );
}
