# LeadGuard: Enterprise Multi-Tenant CRM Platform

> **Course:** SE 4525 — Software Engineering  
> **Approved Project Topic:** LeadGuard (CRM with Guaranteed Lead Ownership & Autonomous SLA Escalation)  
> **Project Team Members:**
> - **Musa** — Backend Lead, Database Architect & Cloud Integrations Specialist
> - **Emaan** — Frontend Lead, UI/UX Designer & Client-State Architect
> - **Aqsa H.** — QA Lead, Security Analyst & Project Manager / Scrum Master  

---

## 📌 Table of Contents
- [1. Executive Overview & Problem Statement](#1-executive-overview--problem-statement)
- [2. SE 4525 Course Deliverables (Tasks 1, 2, & 3)](#2-se-4525-course-deliverables-tasks-1-2--3)
- [3. Quick Start & Launch Guide (Windows, macOS, Linux)](#3-quick-start--launch-guide-windows-macos-linux)
  - [Method A: One-Click Launch Scripts (Recommended)](#method-a-one-click-launch-scripts-recommended)
  - [Method B: Docker Compose (Local Database)](#method-b-docker-compose-local-database)
  - [Method C: Manual Setup](#method-c-manual-setup)
- [4. Demo Accounts & 5-Minute Evaluation Walkthrough](#4-demo-accounts--5-minute-evaluation-walkthrough)
- [5. System Architecture & Tech Stack](#5-system-architecture--tech-stack)
- [6. Core Capabilities & Architectural Guarantees](#6-core-capabilities--architectural-guarantees)
- [7. External Cloud Integrations](#7-external-cloud-integrations)
- [8. Automated Testing & Verification](#8-automated-testing--verification)
- [9. Production Cloud Deployment (Render + Neon)](#9-production-cloud-deployment-render--neon)
- [10. Troubleshooting & FAQ](#10-troubleshooting--faq)

---

## 1. Executive Overview & Problem Statement

In small-to-medium service enterprises (solar contractors, medical clinics, real estate brokerages), **up to 30% of high-intent sales inquiries are lost or abandoned** because no single representative takes ownership, or inquiries sit unacknowledged in an inbox.

**LeadGuard** solves this through architectural guarantees:
- **Zero Orphaned Leads:** Every incoming inquiry (web form, WhatsApp, API) is immediately assigned to exactly one accountable owner via capacity-aware round-robin routing.
- **Autonomous SLA Escalation:** An asynchronous background worker enforces strict countdown deadlines (`ack_deadline`). If an owner fails to acknowledge an assigned lead within the SLA window, the system atomically reassigns the lead up the management chain and triggers an urgent Telegram alert.
- **Zero Double-Escalations:** Concurrency protection powered by PostgreSQL's `SELECT ... FOR UPDATE SKIP LOCKED` guarantees that parallel worker daemons or server clusters never double-escalate the same lead.
- **Tamper-Proof Audit History:** Critical actions (`lead.escalated`, `payment.received`, `role.changed`) are recorded in an append-only ledger protected by database trigger functions that abort any SQL `UPDATE` or `DELETE`.
- **Real-Time Responsiveness:** Server-Sent Events (SSE) push live notifications and countdown updates to active browser sessions without requiring page refreshes.

---

## 2. SE 4525 Course Deliverables (Tasks 1, 2, & 3)

| Task ID | Description | Status | Deliverable Document Link |
|---|---|---|---|
| **SE Task 1** | Project Selection & Scope Inception | **Completed** | Chose **LeadGuard (Multi-Tenant CRM)** |
| **SE Task 2** | Software Process Model Selection & Software Design | **Completed** | [📄 SE Task 2 Software Design Report](docs/SE_Task_2_Software_Design_Report.md) |
| **SE Task 3** | Project Scope, WBS, Scheduling, Size/Cost & Risk Plan | **Completed** | [📄 SE Task 3 Project Management Report](docs/SE_Task_3_Project_Management_Report.md) |

### Summary of SE Task 2 Components:
- **Process Model Selection:** Agile / Scrum framework selected and justified against Waterfall, Spiral, and Prototyping models. Complete mapping of 4 two-week sprint roadmaps.
- **Software Design:**
  - Multi-tier system architecture and component interaction diagram.
  - System actor identification (Owner, Manager, Sales, Junior, External Customer, System Daemon, External Webhooks) and complete Use Case specifications.
  - Relational Entity-Relationship Diagram (ERD) with 18 PostgreSQL tables, indexing strategies, and database trigger functions.
  - Visual wireframes for Executive Dashboard, Opportunity Kanban Board with stage gates, Lead SLA countdown timers, and Team RBAC matrix.
  - Module responsibilities breakdown.

### Summary of SE Task 3 Components:
- **Scope & WBS:** Detailed 8-category hierarchical Work Breakdown Structure (WBS) down to 3 levels.
- **Scheduling:** 8-week activity dependency matrix, Mermaid Gantt chart, and explicit assignment of responsibilities to team members (**Musa**, **Emaan**, **Aqsa H.**).
- **Size & Cost Estimation:**
  - Function Point Analysis: **264.45 Adjusted Function Points (AFP)**.
  - COCOMO II estimation: **14.0 KSLOC** / **51.8 Person-Months** commercial baseline.
  - Itemized resource budget: Human labor, hardware, and cloud hosting totaling **$17,544.40**.
- **Risk Management:** Assessment of 6 critical technical, operational, and integration risks with probability-impact matrix, severity rankings, and mitigation/contingency protocols.

---

## 3. Quick Start & Launch Guide (Windows, macOS, Linux)

LeadGuard is engineered to run on **Windows (cmd / PowerShell)**, **macOS**, and **Linux** with **zero setup required**.

### Prerequisites:
- **Node.js 20 or newer** (`node -v` should output `v20.x` or higher). Download from [nodejs.org](https://nodejs.org/).
- **Zero Database Installations Required:** LeadGuard now includes an **Embedded Local Database (PGlite)** built right in! You do **NOT** need to install PostgreSQL, configure Docker, or create any cloud accounts. It stores data locally in `./data/leadguard-db` automatically.
*(Optional: If you ever want to connect to a cloud Neon or Docker PostgreSQL database, you can simply set `DATABASE_URL` in `.env`).*

---

### Method A: One-Click Launch Scripts (Easiest for Presentations)

#### On Windows:
Double-click `start.bat` (or open Command Prompt / PowerShell and type `start.bat`):
```cmd
start.bat
```

#### On macOS / Linux:
Open Terminal in the project folder and run:
```bash
./start.sh
```

#### Cross-Platform via npm:
```bash
npm start
```
*(or `npm run launch`)*

> **What the launcher automatically does:**
> 1. Verifies Node.js runtime ($\ge 20$).
> 2. Auto-creates `.env` with a zero-config embedded database and secure encryption keys.
> 3. Boots the embedded database, synchronizes the full PostgreSQL schema, and auto-seeds the **Sunrise Solar (Demo)** workspace.
> 4. Launches the server and **automatically opens your browser** directly to **`http://localhost:3000`**!

---

### Method B: Docker Compose (Local Database)

If you have Docker Desktop installed, you can spin up a local PostgreSQL container in seconds:
```bash
# 1. Start PostgreSQL 16 container in background
docker compose up -d

# 2. Run the application
npm run launch
```
*(The launcher will automatically detect and connect to the local container).*

---

### Method C: Manual Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   # Copy example environment
   cp .env.example .env
   ```
   Open `.env` in any text editor:
   - Paste your Neon connection string into `DATABASE_URL`:
     ```env
     DATABASE_URL=postgresql://USER:PASSWORD@ep-xyz.neon.tech/neondb?sslmode=require
     ```
   - Generate and paste a 32-byte encryption key:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```

3. **Synchronize database & seed demo data:**
   ```bash
   npm run seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser to: **`http://localhost:3000`**

---

## 4. Demo Accounts & 5-Minute Evaluation Walkthrough

The seed command creates the **Sunrise Solar (Demo)** workspace populated with realistic sales pipelines, ~300 contacts, active opportunities, and team members.

### Evaluation Credentials:
All demo accounts share the password: **`Demo@12345`**

| Role / User | Email | Access Scope & Evaluation Focus |
|---|---|---|
| **Workspace Owner** | `owner@sunrise.demo` | Full administrative control, billing, role editing, integration keys. |
| **Sales Manager** | `manager@sunrise.demo` | Reassignment privileges, pipeline oversight, recovery queue. |
| **Sales Agent** | `ayesha@sunrise.demo` | Normal CRM access, WhatsApp inbox, lead acknowledgment. |
| **Junior Agent** | `omar@sunrise.demo` | **Restricted / Masked permissions:** Deal values, financial KPIs, and phone numbers are hidden as `[Hidden]`. Audit logs return HTTP 403. |
| **Admin** | `admin@sunrise.demo` | System administration & user invite management. |

### 5-Minute Evaluation Script:
1. **Lead SLA Countdown & Escalation:**
   - Log in as `ayesha@sunrise.demo`.
   - In a separate incognito window, open the public form at `http://localhost:3000/api/public/form/<token>` and submit a test inquiry.
   - Observe the live countdown timer on Ayesha's lead view without refreshing the page.
   - If not acknowledged within the window (set to 30s in demo settings), observe the lead autonomously escalate to the manager, accompanied by an audit log entry.
2. **Interactive Kanban Stage Gates:**
   - Open **Opportunities**. Drag a card to the **Design & Quote** stage.
   - Notice the movement is blocked until the mandatory field (*"Roof Size"* or custom requirement) is filled.
3. **Data Masking & RBAC:**
   - Log in as `omar@sunrise.demo`.
   - Verify that financial metrics and contact details appear masked as `[Hidden]`.
   - Attempt to navigate directly to `/api/audit` — observe the strict **HTTP 403 Forbidden** security response.
4. **Tamper-Proof Audit Trail:**
   - Log in as `owner@sunrise.demo` and navigate to **Audit Log**.
   - Review immutable records with actor attribution, timestamp, and JSON diffs (`before_val` and `after_val`).

---

## 5. System Architecture & Tech Stack

```
Browser Client (React 18 + Vite 5)
       │  (HTTPS / SSE: /api/events)
       ▼
Express.js Server (Port 3000)
 ├── Security: Helmet CSP, CSRF Guard, Scrypt Auth, Rate Limiter
 ├── REST API: /api/auth, /api/crm, /api/leads, /api/opportunities
 ├── Webhooks: /webhooks/twilio, /webhooks/stripe (HMAC Signature Verified)
 ├── OAuth 2.0: /oauth/google/callback
 └── Autonomous Background Worker (Every 2000ms):
       ├── SLA Deadline Detection (SELECT ... FOR UPDATE SKIP LOCKED)
       ├── Automatic Reassignment & Escalation Engine
       └── Multi-Channel Alert Dispatcher (Telegram / Twilio)
       │
       ▼
PostgreSQL Database (Neon / Local)
 ├── Multi-tenant Row-Level Isolation (workspace_id on all tables)
 ├── AES-256-GCM Encrypted Credentials Vault
 └── PostgreSQL Engine Immutability Triggers (prevent_audit_tampering)
```

| Layer | Technology Choice & Rationale |
|---|---|
| **Frontend SPA** | React 18, Vite 5, React Router 6, Custom CSS Tokens (Zero bulky third-party UI kits, fast 390px mobile responsiveness). |
| **Server & API** | Node.js 20+, Express 4 (ES Modules), Zod schema validation, Helmet security headers. |
| **Database** | PostgreSQL 14+ (`pg` client with pure SQL parameterization, advisory locks, and transaction rollbacks). |
| **Real-Time Push** | Server-Sent Events (SSE) over persistent HTTP connection. |
| **Background Daemon** | Autonomous Node.js loop with atomic row locking (`FOR UPDATE SKIP LOCKED`). |
| **Cryptography** | Node.js native `crypto.scrypt` (salted password hashing) and `aes-256-gcm` (credential encryption). |

---

## 6. Core Capabilities & Architectural Guarantees

1. **Guaranteed Lead Ownership:**
   A lead can never enter an unassigned or orphaned state. The round-robin algorithm prioritizes available agents, checking capacity limits (`max_open_leads`). If all agents are busy or offline, assignment seamlessly falls back to backup staff $\rightarrow$ manager $\rightarrow$ workspace owner.
2. **Atomic SLA Concurrency:**
   Worker escalations use explicit database transactions with row-level locks. If multiple worker processes check deadlines at the same time, `SKIP LOCKED` ensures each lead is processed exactly once with zero race conditions.
3. **Database-Enforced Immutability:**
   Audit logs cannot be tampered with—even by database administrators running raw SQL. An active database trigger intercepts any `UPDATE` or `DELETE` statement on `audit_logs` and aborts the query.
4. **Client-Side Zero-Latency Experience:**
   The client subscribes to `/api/events`. When a backend event commits, an SSE invalidation packet triggers selective component re-fetching, providing real-time reactivity without heavy WebSocket overhead.

---

## 7. External Cloud Integrations

Integration credentials are entered on the **Integrations** page per workspace, tested before saving, and stored encrypted with **AES-256-GCM**:

- **Twilio WhatsApp / SMS:** Two-way messaging sandbox. Inbound messages create contacts and leads; outbound replies are dispatched directly from the CRM inbox.
- **Meta WhatsApp Cloud API:** First-class alternative to Twilio for native Meta WhatsApp Business messaging.
- **Stripe Payments:** Generates hosted Stripe Checkout links directly from sales opportunities. Webhooks cryptographically verify `checkout.session.completed` and automatically mark deals as **Paid**.
- **Google Calendar (OAuth 2.0):** Books customer appointments directly into the representative's Google Calendar with real-time busy slot detection.
- **Telegram Bot API:** Instant push notifications delivered to representatives' Telegram accounts when an SLA warning occurs or an urgent lead is escalated.

---

## 8. Automated Testing & Verification

LeadGuard includes a comprehensive automated test suite consisting of **99 end-to-end integration and smoke tests**:

```bash
# Execute the full automated test suite
npm test
```

### What the test suite validates:
- **Part 1 (Smoke Tests - 75 checks):**
  - Tenant onboarding and workspace boundary isolation.
  - Role-Based Access Control and financial value masking.
  - Inbound webhook HMAC signature validation and replay defense.
  - Dynamic pipeline stage gate validation.
  - Database trigger immutability checks on `audit_logs`.
- **Part 2 (Acceptance & Concurrency Tests - 24 checks):**
  - 4 concurrent workers attempting to escalate the same overdue lead simultaneously.
  - Verification that the lead is escalated **exactly once**.
  - Telegram alert queue dispatching.
  - Session expiration and CSRF protection headers.

---

## 9. Production Cloud Deployment (Render + Neon)

LeadGuard is optimized for free deployment on **Render** (Web Service) and **Neon** (Serverless PostgreSQL):

1. **Database:** Create a free project at [console.neon.tech](https://console.neon.tech) and copy your connection string.
2. **Web Service on Render:**
   - Connect your GitHub repository to [Render](https://dashboard.render.com).
   - Choose **Node** runtime.
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`
3. **Environment Variables:**
   - `DATABASE_URL`: Your Neon connection string.
   - `ENCRYPTION_KEY`: A 64-character random hex string (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
4. Render automatically assigns `RENDER_EXTERNAL_URL` which configures `APP_URL` for webhooks and OAuth redirects.

---

## 10. Troubleshooting & FAQ

| Problem | Root Cause | Solution |
|---|---|---|
| `Node.js version must be 20+` | Outdated Node.js runtime. | Upgrade Node.js from [nodejs.org](https://nodejs.org/). |
| `Missing environment variable DATABASE_URL` | `.env` missing or unpopulated. | Run `./start.sh` or `start.bat`; the launcher creates `.env` and guides setup. |
| `password authentication failed` | Incorrect Neon/Postgres password. | Re-copy connection string from Neon; ensure `&channel_binding=require` is removed if present. |
| `EADDRINUSE :3000` | Port 3000 is occupied by another process. | Change `PORT=3001` in your `.env` file. |
| `Stored credentials cannot be decrypted` | `ENCRYPTION_KEY` was altered. | Restore the original `ENCRYPTION_KEY` in `.env` or re-save integration credentials. |

---

## 👥 SE 4525 Project Team Sign-Off

This project and associated documentation represent original software engineering work conducted for **SE 4525**:

- **Musa** — Backend Lead & Integrations Architect  
- **Emaan** — Frontend Lead & UI/UX Designer  
- **Aqsa H.** — QA Lead, Security Analyst & Scrum Master  
