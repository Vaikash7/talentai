# 🚀 TalentAI
## AI-Powered Recruitment & Talent Marketplace

An intelligent Talent Marketplace that connects **Internal Employees** and **External Candidates** with **Jobs**, **Internal Projects**, **Learning Resources**, and **Career Paths** using **Google Gemini AI** together with an **Explainable Rule-Based Matching Engine**.

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Language-Python-3776AB?logo=python)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4)
![Azure SQL](https://img.shields.io/badge/Database-Azure%20SQL-0078D4)
![Azure Blob](https://img.shields.io/badge/Storage-Azure%20Blob-0078D4)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

# 📚 Table of Contents

- 🎯 Problem Statement
- 💡 Why TalentAI?
- ✨ Features
- 🏗️ System Architecture
- 🔄 Application Workflow
- 🛠️ Tech Stack
- 📂 Project Structure
- 🤖 AI Integration Strategy
- 🧠 Matching Engine
- 🌐 Internal Mobility
- 🗄️ Database Design
- ☁️ Azure Services
- ⚙️ Setup Guide
- 👤 Demo Credentials
- 📸 Screenshots
- 🔐 Security
- 🚀 Future Enhancements
- ⚠️ Known Limitations

---

# 🎯 Problem Statement

Organizations struggle to identify the right talent internally and externally, while employees often lack visibility into career growth opportunities.

TalentAI solves this by intelligently connecting people with:

- 💼 Jobs
- 📂 Internal Projects
- 📚 Learning Resources
- 📈 Career Paths

based on their:

- Skills
- Experience
- Career Aspirations

---

# 💡 Why TalentAI?

## 🏢 Organizations

- Reduce hiring costs
- Improve internal mobility
- Discover hidden talent
- Faster recruitment

## 👨 Employees

- Career Growth
- Internal Project Opportunities
- Learning Recommendations
- Career Roadmap

## 🌍 External Candidates

- Personalized Job Matching
- Skill Gap Analysis
- Career Guidance

---

# ✨ Features

| 👨 Candidate | 👩 Recruiter | 🛡️ Admin |
|-------------|--------------|-----------|
| Register as Internal / External | Post Jobs | Platform Dashboard |
| Upload Resume | Post Internal Projects | User Management |
| **Gemini AI Skill Extraction** | Candidate Matching | Learning Resources |
| **AI Resume Summary** | AI Match Rationale | Platform Statistics |
| Job Matching | Explainable Match Scores | Admin Controls |
| Career Recommendations (7 tracks) | Manage Job Posts | |
| Learning Recommendations | Internal Mobility (priority sorting) | |
| Dark / Light Theme Toggle | | |

**Also included:** a public landing page (marketing/intro page shown to logged-out visitors), a unified login page with automatic role-based redirect, and job lifecycle management (open → close → reopen, or draft → publish).

---

# 🏗️ System Architecture

```text
                     React Frontend
                           │
                    REST API + JWT
                           │
                     FastAPI Backend
                           │
 ┌──────────────┬──────────────┬──────────────┐
 │ Authentication│ Candidate    │ Recruiter    │
 ├──────────────┼──────────────┼──────────────┤
 │ Admin Module │ Matching     │ Career Engine│
 └──────────────┴──────────────┴──────────────┘
                           │
                    SQLAlchemy ORM
                           │
                  Azure SQL Database
                           │
                    Azure Blob Storage
```

---

# 🔄 Application Workflow

```text
Candidate Registration
        │
        ▼
Resume Upload
        │
        ▼
Azure Blob Storage
        │
        ▼
Google Gemini AI
        │
        ▼
Skill Extraction
Resume Summary
        │
        ▼
Candidate Profile Creation
        │
        ▼
Recruiter Posts Job
        │
        ▼
Rule-Based Matching Engine
        │
        ▼
Match Score
        │
        ▼
Gemini AI Match Rationale
        │
        ▼
Learning Recommendation
        │
        ▼
Gemini AI Learning Explanation
        │
        ▼
Career Recommendation
        │
        ▼
Gemini AI Career Explanation
```

---

# 🛠️ Tech Stack

| Layer | Technology |
|--------|------------|
| 🎨 Frontend | React.js, React Router, Axios |
| ⚙️ Backend | FastAPI |
| 🐍 Language | Python |
| 🤖 AI | Google Gemini AI (model: `gemini-flash-latest`) |
| 🗄️ ORM | SQLAlchemy |
| 🔄 Migration | Alembic |
| ☁️ Cloud | Microsoft Azure |
| 💾 Database | Azure SQL Database |
| 📂 Storage | Azure Blob Storage |
| 🔐 Authentication | JWT + bcrypt |
| 🌐 API | REST API |
| 🔧 Version Control | Git & GitHub |

---

# 📂 Project Structure

```text
talentai/
│
├── talentai-backend/
│   ├── auth/
│   ├── candidates/
│   ├── recruiters/
│   ├── admin/
│   ├── services/
│   ├── repositories/
│   ├── matching/
│   ├── storage/
│   ├── schemas/
│   ├── db/
│   ├── core/
│   ├── ai/
│   └── utils/
│
└── talentai-frontend/
    ├── pages/
    ├── components/
    ├── auth/
    ├── api/
    ├── routes/
    └── styles/
```

---

# 🤖 AI Integration Strategy

TalentAI integrates **Google Gemini AI** to provide intelligent resume analysis while preserving a reliable rule-based fallback.

### Gemini AI is used for:

- ✅ Skill Extraction
- ✅ Resume Summary
- ✅ Match Rationale
- ✅ Career Recommendation Explanation
- ✅ Learning Recommendation Explanation

All Gemini calls are isolated inside `app/ai/gemini_client.py`, called from the existing service layer (`candidate_service.py`, `matching_service.py`, `career_service.py`, `learning_service.py`) — no routers, repositories, or database models were changed to add this integration.

### Automatic Fallback

If Gemini is unavailable, exceeds quota, or returns an error, the application automatically switches to the existing rule-based implementation, ensuring uninterrupted functionality. This fallback has been verified working in real usage, not just in theory.

This hybrid approach provides:

- AI-powered insights
- Explainable recommendations
- High reliability
- Enterprise-ready architecture

---

# 🧠 Matching Engine

TalentAI uses a **Hybrid Matching Engine** combining **Google Gemini AI** with an **Explainable Rule-Based Matching Engine**.

### Features

- ✅ Gemini AI Skill Extraction
- ✅ AI Resume Summary
- ✅ Skill Overlap Matching
- ✅ Match Percentage
- ✅ AI Match Rationale
- ✅ Missing Skill Detection
- ✅ Learning Recommendation
- ✅ AI Learning Explanation
- ✅ Career Readiness Score (across 7 career tracks: Backend Developer, Frontend Developer, Full Stack Developer, Data Engineer, Data Analyst, Cloud Engineer, DevOps Engineer)
- ✅ AI Career Recommendation
- ✅ Internal Employee Prioritization
- ✅ Automatic Rule-Based Fallback

**Note on scoring philosophy:** the underlying skill-match *score* itself is always deterministic and rule-based (never AI-generated) — this keeps every match auditable and explainable. Gemini is used only to generate the natural-language *explanation* layered on top of that score, not to compute the score itself.

---

# 🌐 Internal Mobility

Internal Projects and External Jobs use the same matching engine, but internal projects prioritize internal employees differently:

- The matching **score itself is never changed or filtered** based on employee type — every candidate is scored purely on skill match.
- For job postings marked as **Internal Project**, the candidate list is **sorted** so internal employees appear first, while external candidates remain fully visible below them.
- This was a deliberate minimal-change design: sorting instead of filtering means no strong match is ever hidden, and the core scoring algorithm (`matching/scorer.py`) required zero modification.

---

# 🗄️ Database Design

## Core Tables

- users
- candidate_profiles (includes `employee_type`: internal / external)
- candidate_skills
- skills
- jobs (includes `job_type`: job / project, and `status`: draft / open / closed)
- job_required_skills
- matches
- learning_resources
- career_paths

### Highlights

- Role-based users (Candidate, Recruiter, Admin — Admin accounts are not self-registerable)
- Internal vs External Candidate support
- Normalized Skills Database
- Explainable Matching
- Alembic Version Control

---

# ☁️ Azure Services Used

- Azure SQL Database
- Azure Blob Storage
- Azure Portal

---

# ⚙️ Setup Guide

## Backend

```powershell
cd talentai-backend

python -m venv venv

venv\Scripts\Activate.ps1

pip install -r requirements.txt

copy .env.example .env

alembic upgrade head

python seed_data.py

uvicorn app.main:app --reload
```

**Configure your `.env` file** with:
- `DATABASE_URL` — your Azure SQL connection string
- `JWT_SECRET_KEY` — a random secret (generate with `python -c "import secrets; print(secrets.token_hex(32))"`)
- `AZURE_STORAGE_CONNECTION_STRING` and `AZURE_STORAGE_CONTAINER_NAME` — if using `STORAGE_BACKEND=azure` (set to `local` to skip Azure Blob Storage for local development)
- `GEMINI_API_KEY` — get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey). No billing account is required for the free tier. If this key is left blank or the API is unavailable, the app automatically falls back to rule-based logic — Gemini is an enhancement, not a requirement to run the app.

Backend

http://localhost:8000


Swagger

http://localhost:8000/docs


---

## Frontend

```powershell
cd talentai-frontend

npm install

copy .env.example .env.local

npm start
```

Confirm `.env.local` contains:

REACT_APP_API_BASE_URL=http://localhost:8000


Frontend

http://localhost:3000


---

# 👤 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Candidate | candidate1@test.com | TestPass123 |
| Recruiter | recruiter1@test.com | TestPass123 |
| Admin | admin1@test.com | TestPass123 |

> **Admin accounts are manually provisioned and are not available through public registration.**

---

# 📸 Screenshots

## Candidate Dashboard


## Recruiter Dashboard


## Job Matching


## Career Recommendation


## Admin Dashboard


---

# 🔐 Security

- JWT Authentication
- bcrypt Password Hashing
- Role-Based Access Control
- Manual Admin Provisioning (Admin is not a selectable option on public registration)
- Environment Variables (no secrets committed to version control)
- Secure Azure SQL Integration
- Azure Blob Storage Integration

---

# 🚀 Future Enhancements

- 👨‍🏫 Mentor Recommendation
- 📅 Interview Scheduling
- 📊 Skill Gap Analytics
- 📧 Email Notifications
- 📈 Organization Analytics
- 💬 AI Career Coach
- 🌍 Semantic Skill Matching using Embeddings

---

# ⚠️ Known Limitations

- Gemini AI depends on API availability and quota; the application automatically falls back to the rule-based engine if the AI service is unavailable, so core functionality is never interrupted.
- Years-of-experience is estimated by Gemini when AI extraction succeeds; this is an inference, not a guaranteed-precise figure, and may be approximate.
- Mentor Module (Planned)
- Limited Automated Testing

---

# ❤️ Developed For

## 🎯 Designathon 2026

### TalentAI – AI-Powered Recruitment & Talent Marketplace

**Built with React • FastAPI • Python • Google Gemini AI • Azure SQL Database • Azure Blob Storage**

---

⭐ **If you found this project interesting, consider giving it a Star on GitHub!**