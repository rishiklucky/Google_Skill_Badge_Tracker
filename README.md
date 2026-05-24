<div align="center">

<img src="https://img.shields.io/badge/Google%20Cloud-Skills%20Boost-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" />
<img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" />

<br /><br />

# 🏅 Google Skill Badge Tracker

**Automatically track your Google Cloud Skill Badges — no more manual searching.**

Upload your badge list, paste your public profile URL, and get a fully colour-coded Excel report in seconds.

</div>

---

## What is this?

Google Cloud Skills Boost offers hundreds of skill badges. Tracking which ones you've completed against a master list is tedious — most people resort to Ctrl+F one badge at a time.

This tool automates that entirely. It scrapes your public profile, compares it against your badge list Excel sheet, and produces a downloadable report with every badge marked as **Completed**, **Not Completed**, or **Not Available**.

---

## How it works

```
Your Profile URL  ──►  Scrape completed badges
Your Excel Sheet  ──►  Read badge names + availability
                            │
                            ▼
                   Compare & classify each badge
                            │
                            ▼
              Download colour-coded Excel report
```

1. **Scrape** — the app fetches your public Google Cloud Skills Boost profile and extracts all completed badge names
2. **Compare** — each badge in your sheet is matched against the scraped list (case-insensitive, whitespace-tolerant)
3. **Output** — a new Excel file is generated with a third column: **Completion Status**

---

## Features

- 🔍 **Auto-scrape** — no manual copy-paste; pulls directly from your public profile
- 📊 **Smart matching** — case-insensitive, ignores extra spaces and minor formatting differences
- 🎨 **Colour-coded output** — green for Completed, amber for Not Completed, red for Not Available
- 🔗 **Hyperlinks preserved** — badge links from your original sheet are kept intact
- ✏️ **Live conditional formatting** — edit a status manually in Excel and the colour updates automatically
- 🔎 **Verify tool** — re-upload your edited sheet to instantly recount each status
- 📈 **Progress summary** — visual breakdown with total, completed, not completed, and not available counts

---

## Excel Sheet Format

Your input file needs **two columns** with headers in row 1:

| Badge Name | Availability Status |
|---|---|
| Create and Manage Cloud Resources | Available |
| Perform Foundational Infrastructure Tasks | Available |
| Some Retired Badge | Not Available |

The app adds a third column to the output:

| Condition | Completion Status |
|---|---|
| Badge found on your profile | ✅ Completed |
| Column 2 is "Not Available" | 🚫 Not Available |
| Badge exists but not on profile | ⏳ Not Completed |

> **Note:** Some badges marked as *Not Completed* may actually be completed but classified differently due to naming differences between your sheet and your profile. Always do a quick review of that column.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 · Vite |
| **Backend** | Python · FastAPI |
| **Scraping** | BeautifulSoup4 · Selenium (JS fallback) |
| **Excel** | openpyxl · Pandas |
| **Deployment** | Render |

---

## Project Structure

```
skill-badge-tracker/
├── backend/
│   ├── main.py              # FastAPI — scraping, processing, static file serving
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main tracker UI
│   │   ├── VerifySheet.jsx  # Verify edited sheet component
│   │   └── *.module.css
│   └── vite.config.js
├── build.sh                 # Build script
├── render.yaml              # Render deployment config
└── README.md
```

---

## Live Demo

> Deployed on Render — [[skill-badge-tracker.onrender.com](https://skill-badge-tracker.onrender.com)](https://google-skill-badge-tracker.onrender.com)
>
> ⚠️ Free tier — may take ~30 seconds to wake up on first visit.

---

<div align="center">
  <sub>Built to save time · No more Ctrl+F</sub>
</div>
