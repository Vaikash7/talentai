"""
Static career track definitions. Each track is a progression of role
stages with associated required skills. This is deterministic, curated
reference data — not AI-generated — matching TalentAI's rule-based
architecture (see app/ai/README.md for the AI extension point).
"""

CAREER_TRACKS = {
    "backend_development": {
        "display_name": "Backend Developer",
        "stages": [
            {"role": "Junior Backend Developer", "required_skills": ["Python", "SQL", "Git"]},
            {"role": "Backend Developer", "required_skills": ["Python", "SQL", "FastAPI", "Docker", "Git"]},
            {"role": "Senior Backend Developer", "required_skills": ["Python", "SQL", "FastAPI", "Docker", "Azure", "CI/CD"]},
            {"role": "Lead Backend Developer", "required_skills": ["Python", "SQL", "FastAPI", "Docker", "Azure", "CI/CD", "Leadership", "Project Management"]},
        ],
    },
    "frontend_development": {
        "display_name": "Frontend Developer",
        "stages": [
            {"role": "Junior Frontend Developer", "required_skills": ["JavaScript", "React", "Git"]},
            {"role": "Frontend Developer", "required_skills": ["JavaScript", "TypeScript", "React", "UI/UX Design", "Git"]},
            {"role": "Senior Frontend Developer", "required_skills": ["JavaScript", "TypeScript", "React", "UI/UX Design", "Figma", "CI/CD"]},
        ],
    },
    "fullstack_development": {
        "display_name": "Full Stack Developer",
        "stages": [
            {"role": "Junior Full Stack Developer", "required_skills": ["JavaScript", "Python", "React", "SQL", "Git"]},
            {"role": "Full Stack Developer", "required_skills": ["JavaScript", "TypeScript", "Python", "React", "FastAPI", "SQL", "Git"]},
            {"role": "Senior Full Stack Developer", "required_skills": ["JavaScript", "TypeScript", "Python", "React", "FastAPI", "SQL", "Docker", "Azure", "CI/CD"]},
        ],
    },
    "data_engineering": {
        "display_name": "Data Engineer",
        "stages": [
            {"role": "Junior Data Engineer", "required_skills": ["SQL", "Python", "Git"]},
            {"role": "Data Engineer", "required_skills": ["SQL", "Python", "Azure", "Docker", "CI/CD"]},
            {"role": "Senior Data Engineer", "required_skills": ["SQL", "Python", "Azure", "Docker", "CI/CD", "Kubernetes", "Machine Learning"]},
        ],
    },
    "data_analytics": {
        "display_name": "Data Analyst",
        "stages": [
            {"role": "Junior Data Analyst", "required_skills": ["SQL", "Data Analysis", "Python"]},
            {"role": "Data Analyst", "required_skills": ["SQL", "Data Analysis", "Python", "Power BI"]},
            {"role": "Senior Data Analyst / Data Scientist", "required_skills": ["SQL", "Data Analysis", "Python", "Power BI", "Machine Learning"]},
        ],
    },
    "cloud_engineering": {
        "display_name": "Cloud Engineer",
        "stages": [
            {"role": "Junior Cloud Engineer", "required_skills": ["Azure", "Git", "CI/CD"]},
            {"role": "Cloud Engineer", "required_skills": ["Azure", "AWS", "Docker", "CI/CD", "Git"]},
            {"role": "Senior Cloud Engineer", "required_skills": ["Azure", "AWS", "Docker", "Kubernetes", "CI/CD", "Git"]},
        ],
    },
    "cloud_devops": {
        "display_name": "DevOps Engineer",
        "stages": [
            {"role": "Junior DevOps Engineer", "required_skills": ["Git", "Docker", "CI/CD"]},
            {"role": "DevOps Engineer", "required_skills": ["Git", "Docker", "CI/CD", "Azure", "Kubernetes"]},
            {"role": "Senior DevOps Engineer", "required_skills": ["Git", "Docker", "CI/CD", "Azure", "Kubernetes", "AWS"]},
        ],
    },
}