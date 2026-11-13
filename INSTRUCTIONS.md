# LeadGuard CRM — Student Presentation & Quick Run Guide
**Course:** SE 4525 (Software Engineering)  
**Project:** LeadGuard — Multi-Tenant CRM  
**Team:** Musa, Emaan, Aqsa H.  

---

## ⚡ The 10-Second Quick Start

You **do NOT** need to install PostgreSQL, Docker, or sign up for any cloud services. Everything (database, demo data, server, web app) is built right in.

### If you are on Windows:
1. Open this project folder.
2. **Double-click `start.bat`**.
3. Your browser will automatically open to **`http://localhost:3000`**.

### If you are on Mac:
1. Open **Terminal** in this project folder.
2. Type:
   ```bash
   ./start.sh
   ```
3. Your browser will open to **`http://localhost:3000`**.

*(To stop the app at any time, close the terminal window or press `Ctrl + C`).*

---

## 💻 Only Prerequisite: Node.js (Version 20+)
Before your presentation, ensure your laptop has Node.js installed:
- Check by opening Command Prompt / Terminal and typing: `node -v`
- If it's missing or below version 20, download and run the installer from: **https://nodejs.org/** (choose LTS).

---

## 🔑 Login Accounts (Ready for Class Demo)
All demo accounts use the exact same password:

> **Password for all accounts:** `Demo@12345`

| Account | Email | Why Show This In Class? |
|---|---|---|
| **Company Owner** | `owner@sunrise.demo` | **Main Dashboard:** Shows full revenue, active leads, team availability, and settings. |
| **Sales Agent** | `ayesha@sunrise.demo` | **Live SLA Countdown:** Shows incoming leads with countdown timers and the *"Acknowledge"* button. |
| **Sales Manager** | `manager@sunrise.demo` | **Recovery Queue:** Shows managerial oversight and reassigning neglected leads. |
| **Junior Agent** | `omar@sunrise.demo` | **Security / Role Masking:** Shows that sensitive customer phone numbers and financial deal values are masked as `[Hidden]`. |

---

## 🎤 5-Minute Class Presentation Script (What to Click & Say)

Here is a ready-to-use walkthrough for your presentation:

### Step 1: Introduction (30 seconds)
- Log in as **`owner@sunrise.demo`** (`Demo@12345`).
- **What to say:** *"LeadGuard is a multi-tenant CRM designed for service companies. Its primary innovation is guaranteed lead ownership: no sales inquiry can ever be orphaned, and every lead has an active SLA countdown timer that escalates automatically if ignored."*

### Step 2: Show the Dashboard & Metrics (1 minute)
- Point out the KPI summary cards: **Active Leads**, **Avg. Response Time**, and **Closed Deals**.
- Point out the **Recent Audit Activity** on the right side.

### Step 3: Show Guaranteed Ownership & SLA Countdown (1.5 minutes)
- Open an incognito browser window or log in as **`ayesha@sunrise.demo`**.
- Go to the **Leads** tab.
- Click on an open lead $\rightarrow$ point out the **live countdown timer** (e.g. `⏱️ 00:30 remaining`).
- **What to say:** *"If Ayesha does not acknowledge this lead before the timer hits zero, LeadGuard’s autonomous background daemon uses PostgreSQL row-level locks to atomically escalate the lead to the manager, without any risk of double-escalation."*
- Click the green **"Acknowledge"** button. The countdown stops and marks the lead acknowledged.

### Step 4: Show the Kanban Opportunity Pipeline & Stage Gates (1 minute)
- Click on **Opportunities** in the top navigation bar.
- Point out the interactive drag-and-drop columns (*Discovery*, *Design & Quote*, *Negotiation*, *Won*).
- Drag a card from *Discovery* to *Design & Quote*.
- **What to say:** *"LeadGuard supports dynamic stage gates. The system intercepts the move and requires mandatory fields (like Roof Size) before allowing the deal to advance to the next pipeline stage."*

### Step 5: Show Security & RBAC Masking (1 minute)
- Log out, and log in as **`omar@sunrise.demo`** (Junior Sales Representative).
- Open **Opportunities** or **Contacts**.
- **What to say:** *"Notice that Omar has restricted financial permissions: deal amounts and sensitive phone numbers are strictly masked on the server as `[Hidden]`. Furthermore, if Omar tries to view the company audit logs directly, the server returns an immediate HTTP 403 Forbidden."*

### Step 6: Show the Immutable Audit Log (30 seconds)
- Log back in as **`owner@sunrise.demo`** and open **Audit Log**.
- **What to say:** *"Every single user action and system escalation is recorded in this audit trail with timestamps, actor attribution, and JSON before/after diffs. At the database level, an SQL trigger blocks any UPDATE or DELETE statement, guaranteeing that this history is 100% tamper-proof."*

---

## 🛠️ Common Questions / Troubleshooting

- **What if the browser doesn't open automatically?**  
  Simply open Chrome or Edge and navigate to: **`http://localhost:3000`**
- **What if it says port 3000 is in use (`EADDRINUSE`)?**  
  Another app is using port 3000. Open the `.env` file in the folder and change `PORT=3000` to `PORT=3001`, then launch again.
- **Where are the course reports for submission?**  
  - **SE Task 2 Report:** `docs/SE_Task_2_Software_Design_Report.md`
  - **SE Task 3 Report:** `docs/SE_Task_3_Project_Management_Report.md`

