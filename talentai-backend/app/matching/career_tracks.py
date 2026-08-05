"""
Static career track definitions. Each track is a progression of role
stages with associated required skills. This is deterministic, curated
reference data — not AI-generated — matching TalentAI's rule-based
architecture (see app/ai/README.md for the AI extension point).

To add a new career track, add a new entry to CAREER_TRACKS below.
"""

CAREER_TRACKS = {
    "backend_development": {
        "display_name": "Backend Development",
        "stages": [
            {
                "role": "Junior Backend Developer",
                "required_skills": ["Python", "SQL", "Git"],
            },
            {
                "role": "Backend Developer",
                "required_skills": ["Python", "SQL", "FastAPI", "Docker", "Git"],
            },
            {
                "role": "Senior Backend Developer",
                "required_skills": ["Python", "SQL", "FastAPI", "Docker", "Azure", "CI/CD"],
            },
            {
                "role": "Lead Backend Developer",
                "required_skills": [
                    "Python", "SQL", "FastAPI", "Docker", "Azure", "CI/CD",
                    "Leadership", "Project Management",
                ],
            },
        ],
    },
    "frontend_development": {
        "display_name": "Frontend Development",
        "stages": [
            {
                "role": "Junior Frontend Developer",
                "required_skills": ["JavaScript", "React", "Git"],
            },
            {
                "role": "Frontend Developer",
                "required_skills": ["JavaScript", "TypeScript", "React", "UI/UX Design", "Git"],
            },
            {
                "role": "Senior Frontend Developer",
                "required_skills": [
                    "JavaScript", "TypeScript", "React", "UI/UX Design", "Figma", "CI/CD",
                ],
            },
        ],
    },
    "data_analytics": {
        "display_name": "Data & Analytics",
        "stages": [
            {
                "role": "Junior Data Analyst",
                "required_skills": ["SQL", "Data Analysis", "Python"],
            },
            {
                "role": "Data Analyst",
                "required_skills": ["SQL", "Data Analysis", "Python", "Power BI"],
            },
            {
                "role": "Senior Data Analyst / Data Scientist",
                "required_skills": ["SQL", "Data Analysis", "Python", "Power BI", "Machine Learning"],
            },
        ],
    },
    "cloud_devops": {
        "display_name": "Cloud & DevOps",
        "stages": [
            {
                "role": "Junior DevOps Engineer",
                "required_skills": ["Git", "Docker", "CI/CD"],
            },
            {
                "role": "DevOps Engineer",
                "required_skills": ["Git", "Docker", "CI/CD", "Azure", "Kubernetes"],
            },
            {
                "role": "Senior DevOps Engineer",
                "required_skills": ["Git", "Docker", "CI/CD", "Azure", "Kubernetes", "AWS"],
            },
        ],
    },
}