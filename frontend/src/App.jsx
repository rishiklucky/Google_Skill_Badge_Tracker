import { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import styles from "./App.module.css";
import VerifySheet from "./VerifySheet";

const API = "/api";

/* ── Stat card ── */
function StatCard({ emoji, value, label, variant }) {
  return (
    <div className={`${styles.statCard} ${styles[variant]}`}>
      <div className={styles.statTop}>
        <span className={styles.statEmoji}>{emoji}</span>
        <span className={styles.statValue}>{value}</span>
      </div>
      <p className={styles.statLabel}>{label}</p>
    </div>
  );
}

/* ── Collapsible badge list ── */
function BadgeList({ badges, dotColor, label, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  if (!badges || badges.length === 0)
    return <p className={styles.emptyNote}>No badges in this category.</p>;
  return (
    <div>
      <button className={styles.toggleBtn} onClick={() => setOpen((o) => !o)}>
        <span className={styles.badgePill} style={{ background: dotColor }} />
        {label}
        <span className={styles.toggleChevron + (open ? " " + styles.toggleChevronOpen : "")}>▼</span>
      </button>
      {open && (
        <ul className={styles.badgeList}>
          {badges.map((b, i) => (
            <li key={i} className={styles.badgeItem}>
              <span className={styles.badgePill} style={{ background: dotColor }} />
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════ */
export default function App() {
  const [url, setUrl]       = useState("");
  const [file, setFile]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [result, setResult] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    onDrop: (accepted) => {
      if (accepted.length > 0) { setFile(accepted[0]); setError(""); }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setResult(null);
    if (!url.trim()) { setError("Please enter your Google Cloud Skills Boost profile URL."); return; }
    if (!file)       { setError("Please upload your Excel or CSV file."); return; }

    const fd = new FormData();
    fd.append("profile_url", url.trim());
    fd.append("file", file);

    setLoading(true);
    try {
      const res = await axios.post(`${API}/process`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => result?.file_id && window.open(`${API}/download/${result.file_id}`, "_blank");
  const handleReset    = () => { setUrl(""); setFile(null); setResult(null); setError(""); };

  const pct = result
    ? result.summary.total > 0
      ? Math.round((result.summary.completed / result.summary.total) * 100)
      : 0
    : 0;

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <div className={styles.logoMark}>🏅</div>
            <div className={styles.logoText}>
              <h1>Skill Badge Tracker</h1>
              <p>Google Cloud Skills Boost</p>
            </div>
          </div>
          <span className={styles.headerBadge}>Auto-Track</span>
        </div>
      </header>

      <main className={styles.main}>

        {/* ══════════════════════════════════
            TRACKER SECTION
        ══════════════════════════════════ */}
        {!result ? (
          <>
            {/* Hero */}
            <div className={styles.hero}>
              <h2 className={styles.heroTitle}>
                Track your <span>Skill Badges</span> instantly
              </h2>
              <p className={styles.heroSub}>
                Paste your public profile URL, upload your badge list, and get a fully
                colour-coded Excel sheet in seconds.
              </p>
            </div>

            {/* Form card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.cardIconBlue}`}>🔗</div>
                <div>
                  <p className={styles.cardTitle}>Profile URL</p>
                  <p className={styles.cardSubtitle}>Must be set to public</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="profile-url">
                    Google Cloud Skills Boost Profile URL
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.inputIcon}>🌐</span>
                    <input
                      id="profile-url"
                      type="url"
                      className={styles.input}
                      placeholder="https://www.cloudskillsboost.google/public_profiles/..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <span className={styles.hint}>
                    ℹ️ Go to your profile → Edit → set visibility to Public
                  </span>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Badge List (.xlsx / .csv)</label>

                  {/* ── Template download banner ── */}
                  <div className={styles.templateBanner}>
                    <div className={styles.templateLeft}>
                      <span className={styles.templateIcon}>📥</span>
                      <div>
                        <p className={styles.templateTitle}>Don't have the badge list?</p>
                        <p className={styles.templateMeta}>
                          Download the pre-built sheet · Last updated <strong>May 2026</strong>
                        </p>
                      </div>
                    </div>
                    <a
                      href="/api/template"
                      download="badge_list.xlsx"
                      className={styles.templateBtn}
                    >
                      ⬇ Download Sheet
                    </a>
                  </div>
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
                        <div>
                          <p className={styles.fileName}>{file.name}</p>
                          <p className={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button
                          type="button"
                          className={styles.removeFile}
                          onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        >✕</button>
                      </div>
                    ) : (
                      <div className={styles.dropContent}>
                        <span className={styles.dropEmoji}>📂</span>
                        <p className={styles.dropText}>
                          {isDragActive ? "Drop it here…" : "Drag & drop your file here"}
                        </p>
                        <p className={styles.dropSub}>or click to browse</p>
                      </div>
                    )}
                  </div>
                  <div className={styles.formatNote}>
                    <span className={styles.formatNoteIcon}>📋</span>
                    <p className={styles.formatNoteText}>
                      Please ensure that the sheet is properly cleaned and formatted, with
                      appropriate headers added in the first row according to the column titles
                      specified below.
                      <span className={styles.formatNoteCols}>
                        <span>Col 1: <strong>Badge Name</strong></span>
                        <span className={styles.formatNoteDot}>·</span>
                        <span>Col 2: <strong>Available</strong> / <strong>Not Available</strong></span>
                      </span>
                    </p>
                  </div>
                </div>

                {error && (
                  <div className={styles.errorBox} role="alert">
                    <span>⚠️</span> {error}
                  </div>
                )}

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading
                    ? <><span className={styles.spinner} /> Scraping & processing…</>
                    : "🚀 Track My Badges"}
                </button>
              </form>

              {loading && (
                <p className={styles.loadingNote}>
                  This may take 10–20 seconds while we scrape your profile…
                </p>
              )}
            </div>
          </>
        ) : (
          /* ══════════════════════════════════
              RESULTS SECTION
          ══════════════════════════════════ */
          <div className={styles.resultsWrapper}>

            {/* ── Summary card ── */}
            <div className={styles.card}>
              <div className={styles.resultTopBar}>
                <div>
                  <p className={styles.resultTitle}>Results</p>
                  <p className={styles.resultSub}>Badge tracking complete</p>
                </div>
                <button className={styles.resetBtn} onClick={handleReset}>
                  ← New Scan
                </button>
              </div>

              <div className={styles.statsGrid}>
                <StatCard emoji="📋" value={result.summary.total}         label="Total"         variant="blue"  />
                <StatCard emoji="✅" value={result.summary.completed}     label="Completed"     variant="green" />
                <StatCard emoji="⏳" value={result.summary.not_completed} label="Not Completed" variant="amber" />
                <StatCard emoji="🚫" value={result.summary.not_available} label="Not Available" variant="red"   />
              </div>

              <div className={styles.progressWrap}>
                <div className={styles.progressMeta}>
                  <span>Completion Progress</span>
                  <span>{pct}%</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className={styles.noteBox}>
                <span className={styles.noteIcon}>💡</span>
                <p className={styles.noteText}>
                  Please verify the badges marked as <strong>"Not Completed,"</strong> as some of
                  them may actually be completed badges but are being incorrectly classified due to
                  differences in naming. Additionally, some entries may not be skill badges and
                  should be reviewed accordingly.
                </p>
              </div>

              <button className={styles.downloadBtn} onClick={handleDownload}>
                ⬇️ Download Updated Excel Sheet
              </button>
            </div>

            {/* ── Scraped badges ── */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.cardIconGreen}`}>✅</div>
                <div>
                  <p className={styles.cardTitle}>Badges on Your Profile</p>
                  <p className={styles.cardSubtitle}>{result.scraped_badges?.length ?? 0} found</p>
                </div>
              </div>
              <BadgeList
                badges={result.scraped_badges}
                dotColor="var(--green)"
                label={`${result.scraped_badges?.length ?? 0} completed badges`}
              />
            </div>

            {/* ── Not completed badges ── */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.cardIconAmber}`}>⏳</div>
                <div>
                  <p className={styles.cardTitle}>Badges Not Yet Completed</p>
                  <p className={styles.cardSubtitle}>
                    {result.not_completed_badges?.length ?? 0} remaining
                  </p>
                </div>
              </div>
              <BadgeList
                badges={result.not_completed_badges}
                dotColor="var(--amber)"
                label={`${result.not_completed_badges?.length ?? 0} not completed`}
                defaultOpen={true}
              />
            </div>

          </div>
        )}

        {/* ── Divider ── */}
        <div className={styles.divider}><span>Verify edited sheet</span></div>

        {/* ── Verify component ── */}
        <VerifySheet />

      </main>

      <footer className={styles.footer}>
        Google Skill Badge Tracker — built to save you time
      </footer>
    </div>
  );
}
