# 🏅 Google Skill Badge Tracker

Automatically track your completed Google Cloud Skills Boost badges against a badge list Excel sheet — no more manual Ctrl+F searching.

---

## Features

- Paste your public Google Cloud Skills Boost profile URL
- Upload a `.xlsx` or `.csv` badge list
- Auto-scrapes your completed badges from the profile page
- Compares and marks each badge as **Completed**, **Not Completed**, or **Not Available**
- Shows a summary with a progress bar
- Download the updated Excel sheet instantly

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18 + Vite                   |
| Backend   | Python FastAPI                    |
| Scraping  | BeautifulSoup4 + Selenium (fallback) |
| Excel     | Pandas + openpyxl                 |

---

## Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **Google Chrome** (for Selenium fallback — optional but recommended)
- **ChromeDriver** matching your Chrome version (for Selenium)

---

## Setup & Run

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Excel Sheet Format

Your Excel/CSV file should have at least 2 columns:

| Badge Name                              | Availability Status |
|-----------------------------------------|---------------------|
| Create and Manage Cloud Resources       | Available           |
| Perform Foundational Infrastructure Tasks | Available         |
| Some Retired Badge                      | Not Available       |

The app will add a **Completion Status** column automatically.

---

## Completion Status Logic

| Condition                                      | Status          |
|------------------------------------------------|-----------------|
| Badge found on your profile                    | ✅ Completed     |
| Column 2 says "Not Available"                  | ❌ Not Available |
| Badge exists but not on your profile           | ⏳ Not Completed |

Matching is **case-insensitive** and ignores extra spaces.

---

## Profile URL

Your profile must be **public**. To make it public:
1. Go to [Google Cloud Skills Boost](https://www.cloudskillsboost.google)
2. Click your profile → **Edit Profile**
3. Set visibility to **Public**

Your profile URL looks like:
```
https://www.cloudskillsboost.google/public_profiles/YOUR_ID
```

---

## Notes on Scraping

Google Cloud Skills Boost renders some content with JavaScript. The backend first tries a fast HTTP request (BeautifulSoup). If no badges are found, it automatically falls back to **Selenium** (headless Chrome).

For Selenium to work, install ChromeDriver:
- Download from https://chromedriver.chromium.org/downloads (match your Chrome version)
- Or use `webdriver-manager`: `pip install webdriver-manager`

If you use `webdriver-manager`, update `backend/main.py`:
```python
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
```
