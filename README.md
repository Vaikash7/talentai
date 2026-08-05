# 🚀 TalentAI
## AI-Powered Recruitment & Talent Marketplace

> **An intelligent Talent Marketplace that connects Internal Employees and External Candidates with Jobs, Internal Projects, Learning Resources, and Career Paths using an Explainable Rule-Based Matching Engine.**

<p align="center">

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python)
![Azure](https://img.shields.io/badge/Azure-0078D4?style=for-the-badge&logo=microsoftazure)
![SQL](https://img.shields.io/badge/Azure_SQL-CC2927?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge)

</p>

---

# 📚 Table of Contents

- 🎯 Problem Statement
- 💡 Why TalentAI?
- ✨ Features
- 🏗️ System Architecture
- 🔄 Application Workflow
- 🛠️ Tech Stack
- 📂 Project Structure
- 🧠 Matching Engine
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

Organizations struggle to identify the right talent **internally and externally**, while employees often lack visibility into career growth opportunities.

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

### 🏢 Organizations

- Reduce hiring costs
- Improve internal mobility
- Discover hidden talent
- Faster recruitment

### 👨 Employees

- Career Growth
- Internal Project Opportunities
- Learning Recommendations
- Career Roadmap

### 🌍 External Candidates

- Personalized Job Matching
- Skill Gap Analysis
- Career Guidance

---

# ✨ Features

| 👨 Candidate | 👩 Recruiter | 🛡️ Admin |
|--------------|-------------|-----------|
| Register as Internal / External | Post Jobs | Platform Dashboard |
| Upload Resume | Post Internal Projects | User Management |
| Automatic Skill Extraction | Candidate Matching | Learning Resources |
| Job Matching | Explainable Match Scores | Platform Statistics |
| Career Recommendations | Manage Job Posts | Admin Controls |
| Learning Recommendations | Internal Mobility | |

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
      Azure Blob Storage / Local Storage
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
Skill Extraction
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
Learning Recommendation
        │
        ▼
Career Recommendation
```

---

# 🛠️ Tech Stack

| Layer | Technology |
|--------|------------|
| 🎨 Frontend | React.js, React Router, Axios |
| ⚙️ Backend | FastAPI |
| 🐍 Language | Python |
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

# 🧠 Matching Engine

TalentAI uses an **Explainable Rule-Based Matching Engine**.

### Features

- ✅ Automatic Skill Extraction
- ✅ Skill Overlap Matching
- ✅ Match Percentage
- ✅ Explainable Match Reason
- ✅ Missing Skill Detection
- ✅ Learning Recommendation
- ✅ Career Readiness Score
- ✅ Internal Employee Prioritization

---

# 🗄️ Database Design

Core Tables

- users
- candidate_profiles
- candidate_skills
- skills
- jobs
- job_required_skills
- matches
- learning_resources
- career_paths

### Highlights

- Role-based users
- Internal vs External Candidate support
- Normalized Skills Database
- Explainable Matching
- Alembic Version Control

---

# ☁️ Azure Services Used

- Azure SQL Database
- Azure Blob Storage
- Azure App Service
- Azure Portal

---

# 🤖 AI Integration Strategy

Originally planned with Claude AI.

To keep the project **completely free** and avoid dependency on paid APIs, the AI layer was replaced with:

- Rule-Based Skill Extraction
- Explainable Match Generation
- Career Recommendation Engine
- Learning Recommendation Engine

The architecture still preserves an **AI Extension Layer**, allowing future integration with:

- Claude
- OpenAI
- Gemini

without redesigning the application.

---

# ⚙️ Setup Guide

## Backend

```powershell
cd talentai-backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

copy .env.example .env

alembic upgrade head

python seed_data.py

uvicorn app.main:app --reload
```

Runs on

```
http://localhost:8000
```

Swagger

```
http://localhost:8000/docs
```

---

## Frontend

```powershell
cd talentai-frontend

npm install

npm start
```

Runs on

```
http://localhost:3000
```

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

*(Add Screenshot)*

---

## Recruiter Dashboard

*(Add Screenshot)*

---

## Job Matching

*(Add Screenshot)*

---

## Career Recommendation

*(Add Screenshot)*

---

## Admin Dashboard

*(Add Screenshot)*

---

# 🔐 Security

- JWT Authentication
- bcrypt Password Hashing
- Role-Based Access Control
- Manual Admin Provisioning
- Environment Variables
- Secure Azure SQL Integration

---

# 🚀 Future Enhancements

- 🤖 Claude / OpenAI / Gemini Integration
- 👨‍🏫 Mentor Recommendation
- 📅 Interview Scheduling
- 📊 Skill Gap Analytics
- 📧 Email Notifications
- 📈 Organization Analytics
- 💬 AI Career Coach

---

# ⚠️ Known Limitations

- Rule-Based Skill Extraction
- Mentor Module (Planned)
- Resume Experience Parsing Pending
- Limited Automated Testing

---

# ❤️ Developed For

## 🎯 Designathon 2026

**TalentAI – AI-Powered Recruitment & Talent Marketplace**

Built with **React • FastAPI • Azure • Python**

---

⭐ **If you found this project interesting, consider giving it a Star on GitHub!**