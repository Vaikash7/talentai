"""
One-time seed script to populate the skills and learning_resources tables
with baseline reference data. Safe to re-run — uses get-or-create logic
so it won't create duplicate rows.

Run with: python seed_data.py
"""

from app.db.session import SessionLocal
from app.db.models.skill import Skill
from app.db.models.learning import LearningResource, ResourceLevel


SKILLS = [
    # Programming languages
    ("Python", "Programming Language"),
    ("JavaScript", "Programming Language"),
    ("TypeScript", "Programming Language"),
    ("Java", "Programming Language"),
    ("C#", "Programming Language"),
    ("SQL", "Programming Language"),
    # Frameworks / libraries
    ("React", "Frontend Framework"),
    ("FastAPI", "Backend Framework"),
    ("Django", "Backend Framework"),
    ("Node.js", "Backend Framework"),
    (".NET", "Backend Framework"),
    # Cloud / DevOps
    ("Azure", "Cloud Platform"),
    ("AWS", "Cloud Platform"),
    ("Docker", "DevOps"),
    ("Kubernetes", "DevOps"),
    ("CI/CD", "DevOps"),
    ("Git", "DevOps"),
    # Data
    ("SQL Server", "Database"),
    ("PostgreSQL", "Database"),
    ("MongoDB", "Database"),
    ("Data Analysis", "Data"),
    ("Machine Learning", "Data"),
    ("Power BI", "Data"),
    # Soft skills
    ("Communication", "Soft Skill"),
    ("Stakeholder Management", "Soft Skill"),
    ("Project Management", "Soft Skill"),
    ("Leadership", "Soft Skill"),
    ("Problem Solving", "Soft Skill"),
    ("Agile/Scrum", "Soft Skill"),
    # Design
    ("UI/UX Design", "Design"),
    ("Figma", "Design"),
]

# (title, provider, url, skill_name, level)
LEARNING_RESOURCES = [
    ("Python for Everybody", "Coursera", "https://www.coursera.org/specializations/python", "Python", ResourceLevel.beginner),
    ("Fluent Python", "O'Reilly", "https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/", "Python", ResourceLevel.advanced),
    ("JavaScript: The Complete Guide", "Udemy", "https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/", "JavaScript", ResourceLevel.beginner),
    ("TypeScript Deep Dive", "Free Online Book", "https://basarat.gitbook.io/typescript/", "TypeScript", ResourceLevel.intermediate),
    ("React – The Complete Guide", "Udemy", "https://www.udemy.com/course/react-the-complete-guide-incl-redux/", "React", ResourceLevel.beginner),
    ("Advanced React Patterns", "Frontend Masters", "https://frontendmasters.com/courses/advanced-react-patterns/", "React", ResourceLevel.advanced),
    ("FastAPI Official Tutorial", "FastAPI Docs", "https://fastapi.tiangolo.com/tutorial/", "FastAPI", ResourceLevel.beginner),
    ("Django for Beginners", "William Vincent", "https://djangoforbeginners.com/", "Django", ResourceLevel.beginner),
    ("Node.js: The Complete Guide", "Udemy", "https://www.udemy.com/course/nodejs-the-complete-guide/", "Node.js", ResourceLevel.beginner),
    ("Microsoft Learn: Azure Fundamentals", "Microsoft", "https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/", "Azure", ResourceLevel.beginner),
    ("AZ-204: Developing Solutions for Azure", "Microsoft", "https://learn.microsoft.com/en-us/certifications/exams/az-204", "Azure", ResourceLevel.intermediate),
    ("AWS Cloud Practitioner Essentials", "AWS", "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/", "AWS", ResourceLevel.beginner),
    ("Docker for Beginners", "Docker Docs", "https://docs.docker.com/get-started/", "Docker", ResourceLevel.beginner),
    ("Kubernetes Basics", "Kubernetes Docs", "https://kubernetes.io/docs/tutorials/kubernetes-basics/", "Kubernetes", ResourceLevel.beginner),
    ("CI/CD with GitHub Actions", "GitHub Docs", "https://docs.github.com/en/actions", "CI/CD", ResourceLevel.intermediate),
    ("Pro Git Book", "Free Online Book", "https://git-scm.com/book/en/v2", "Git", ResourceLevel.beginner),
    ("SQL Server Fundamentals", "Microsoft Learn", "https://learn.microsoft.com/en-us/training/paths/get-started-querying-with-transact-sql/", "SQL Server", ResourceLevel.beginner),
    ("PostgreSQL Tutorial", "PostgreSQL Docs", "https://www.postgresqltutorial.com/", "PostgreSQL", ResourceLevel.beginner),
    ("MongoDB University", "MongoDB", "https://university.mongodb.com/", "MongoDB", ResourceLevel.beginner),
    ("Data Analysis with Python", "freeCodeCamp", "https://www.freecodecamp.org/learn/data-analysis-with-python/", "Data Analysis", ResourceLevel.beginner),
    ("Machine Learning by Andrew Ng", "Coursera", "https://www.coursera.org/learn/machine-learning", "Machine Learning", ResourceLevel.intermediate),
    ("Power BI Essential Training", "LinkedIn Learning", "https://www.linkedin.com/learning/power-bi-essential-training", "Power BI", ResourceLevel.beginner),
    ("Crucial Conversations", "Book", "https://www.vitalsmarts.com/crucial-conversations-book/", "Communication", ResourceLevel.beginner),
    ("Stakeholder Management Masterclass", "Udemy", "https://www.udemy.com/course/stakeholder-management/", "Stakeholder Management", ResourceLevel.intermediate),
    ("Google Project Management Certificate", "Coursera", "https://www.coursera.org/professional-certificates/google-project-management", "Project Management", ResourceLevel.beginner),
    ("The Five Dysfunctions of a Team", "Book", "https://www.tablegroup.com/product/dysfunctions/", "Leadership", ResourceLevel.beginner),
    ("Professional Scrum Master (PSM I)", "Scrum.org", "https://www.scrum.org/professional-scrum-master-i-certification-assessment", "Agile/Scrum", ResourceLevel.intermediate),
    ("Google UX Design Certificate", "Coursera", "https://www.coursera.org/professional-certificates/google-ux-design", "UI/UX Design", ResourceLevel.beginner),
    ("Figma for Beginners", "YouTube / Figma", "https://www.figma.com/resources/learn-design/", "Figma", ResourceLevel.beginner),
]


def seed_skills(db):
    skill_map = {}
    for name, category in SKILLS:
        existing = db.query(Skill).filter(Skill.name == name).first()
        if existing:
            skill_map[name] = existing
            continue
        skill = Skill(name=name, category=category)
        db.add(skill)
        db.flush()  # get the generated id without committing yet
        skill_map[name] = skill
    db.commit()
    print(f"Seeded {len(SKILLS)} skills (existing ones skipped).")
    return skill_map


def seed_learning_resources(db, skill_map):
    count_created = 0
    for title, provider, url, skill_name, level in LEARNING_RESOURCES:
        skill = skill_map.get(skill_name)
        if not skill:
            print(f"  Skipping '{title}' — skill '{skill_name}' not found.")
            continue
        existing = (
            db.query(LearningResource)
            .filter(LearningResource.title == title, LearningResource.skill_id == skill.id)
            .first()
        )
        if existing:
            continue
        resource = LearningResource(
            title=title,
            provider=provider,
            url=url,
            skill_id=skill.id,
            level=level,
        )
        db.add(resource)
        count_created += 1
    db.commit()
    print(f"Seeded {count_created} new learning resources (existing ones skipped).")


def main():
    db = SessionLocal()
    try:
        skill_map = seed_skills(db)
        seed_learning_resources(db, skill_map)
        print("Seeding complete.")
    finally:
        db.close()


if __name__ == "__main__":
    main()