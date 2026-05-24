<div align="center">

<img src="https://img.shields.io/badge/Google%20Cloud-Skills%20Boost-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Google Cloud Skills Boost" />
<img src="https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
<img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />

# 🏅 Google Skill Badge Tracker

**Stop searching manually. Track all your Google Cloud Skill Badges in seconds.**

Upload your badge list Excel sheet, paste your public profile URL, and get a fully colour-coded, downloadable report — automatically.

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Usage](#-usage) · [Deploy](#-deploy-to-render) · [FAQ](#-faq)

</div>

---

## ✨ Features

| | Feature |
|---|---|
| 🔍 | **Auto-scrape** — extracts completed badges directly from your public Google Cloud Skills Boost profile |
| 📊 | **Smart comparison** — matches badge names case-insensitively, ignoring extra spaces and minor formatting differences |
| 🎨 | **Colour-coded Excel output** — Completed (green), Not Completed (amber), Not Available (red) with live conditional formatting |
| 🔗 | **Hyperlinks preserved** — all badge links from your original sheet are kept intact in the output file |
| ✏️ | **Manual edit support** — change a status in the downloaded sheet and the colour updates automatically |
| 🔎 | **Verify tool** — re-upload your edited sheet to get an instant count of each status |
| 📈 | **Progress summary** — total, completed, not completed, and not available counts with a progress bar |
| ⬇️ | **One-click download** — get the updated `.xlsx` file instantly |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite |
| **Backend** | Python · FastAPI |
| **Scraping** | BeautifulSoup4 · Selenium (JS fallback) |
| **Excel Processing** | openpyxl · Pandas |
| **Deployment** | Render (single web service) |

---

## 🚀 Getting Started

### Prerequisites

- Python **3.10+**
- Node.js **18+**
- Google Chrome + matching ChromeDriver *(optional — only needed for Selenium fallback)*

### 1 · Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/skill-badge-tracker.git
cd skill-badge-tracker
```

### 2 · Start the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3 · Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

> The Vite dev server proxies all `/api` requests to the FastAPI backend automatically.

---

## 📖 Usage

### Step 1 — Prepare your Excel sheet

Your file must have **at least 2 columns** with headers in row 1:

| Badge Name | Availability Status |
|---|---|
| Create and Manage Cloud Resources | Available |
| Perform Foundational Infrastructure Tasks | Available |
| Some Retired Badge | Not Available |

> **Tip:** Badge names in column 1 can be hyperlinks — the app preserves them in the output.

### Step 2 — Make your profile public

1. Go to [Google Cloud Skills Boost](https://www.cloudskillsboost.google)
2. Click your avatar → **Edit Profile**
3. Set visibility to **Public**

Your profile URL will look like:
```
https://www.cloudskillsboost.google/public_profiles/YOUR_ID
```

### Step 3 — Track

1. Paste your profile URL
2. Upload your `.xlsx` or `.csv` file
3. Click **Track My Badges**
4. Download the updated sheet

### Output — Completion Status column

| Condition | Status |
|---|---|
| Badge found on your profile | ✅ **Completed** |
| Column 2 is "Not Available" | 🚫 **Not Available** |
| Badge exists but not on profile | ⏳ **Not Completed** |

> **Note:** Please verify badges marked as *Not Completed* — some may be completed but classified differently due to naming differences between your sheet and your profile.

### Step 4 — Verify after manual edits

After editing the downloaded sheet manually, use the **Verify Edited Sheet** panel to re-upload it and instantly see the updated count for each status.

---

## ☁️ Deploy to Render

Deploy as a **single web service** — FastAPI serves both the API and the built React frontend.

### 1 · Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/skill-badge-tracker.git
git push -u origin main
```

### 2 · Create a Render Web Service

1. Go to [render.com](https://render.com) → **New +** → **Web Service**
2. Connect your GitHub repo
3. Render auto-detects `render.yaml` — click **Apply**

Or configure manually:

| Setting | Value |
|---|---|
| **Runtime** | Python 3 |
| **Build Command** | `./build.sh` |
| **Start Command** | `uvicorn backend.main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | Free |

### 3 · Deploy

Click **Create Web Service**. Render will install dependencies, build the React app, and start the server. Your app will be live at `https://your-app-name.onrender.com`.

> **Free tier note:** The service spins down after 15 minutes of inactivity. The first request after sleep takes ~30 seconds. Upgrade to Starter ($7/mo) to keep it always-on.

---

## ❓ FAQ

**Why are some completed badges showing as Not Completed?**
The badge name in your Excel sheet may differ slightly from how it appears on your profile (e.g. punctuation, abbreviations). Edit the status manually in the downloaded sheet — the conditional formatting will update the colour automatically.

**Does Selenium work on Render's free tier?**
No. Headless Chrome requires system dependencies not available on the free tier. The app falls back to BeautifulSoup for public profiles, which works for most cases. If you need Selenium, use a paid Render plan or run locally.

**How do I install ChromeDriver locally?**

Option A — manual:
```
https://chromedriver.chromium.org/downloads
```
Download the version matching your Chrome installation.

Option B — `webdriver-manager`:
```bash
pip install webdriver-manager
```
Then update `backend/main.py`:
```python
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
```

**Are my files stored anywhere?**
No. Uploaded files are processed in memory. The generated output Excel is saved to the server's `/tmp` directory and is only accessible via a one-time UUID link. It is not persisted across server restarts.

---

## 📁 Project Structure

```
skill-badge-tracker/
├── backend/
│   ├── main.py              # FastAPI app — scraping, Excel processing, static serving
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main tracker UI
│   │   ├── App.module.css
│   │   ├── VerifySheet.jsx  # Verify edited sheet component
│   │   └── VerifySheet.module.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── build.sh                 # Render build script
├── render.yaml              # Render deployment config
└── README.md
```

---

## 📄 License

MIT — free to use, modify, and distribute.

---

<div align="center">
  <sub>Built to save time · No more Ctrl+F</sub>
</div>
