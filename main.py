from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF
import docx

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Resume Optimizer API is running!"}

def extract_text_from_pdf(file_bytes):
    text = ""
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text

def extract_text_from_docx(file_bytes):
    doc = docx.Document(file_bytes)
    return "\n".join([p.text for p in doc.paragraphs])

# Job role to required skills mapping
JOB_ROLE_SKILLS = {
    "Frontend Developer": ["HTML", "CSS", "JavaScript", "React"],
    "Backend Developer": ["Python", "FastAPI", "SQL", "Databases"],
    "Full Stack Developer": ["HTML", "CSS", "JavaScript", "React", "Python", "FastAPI", "SQL"],
    "Data Analyst": ["Python", "Machine Learning", "Data Analysis", "SQL"],
    "Machine Learning Engineer": ["Python", "Machine Learning", "Pandas", "Scikit-learn", "Deep Learning"],
    "DevOps Engineer": ["Linux", "Docker", "CI/CD", "Kubernetes", "Cloud"],
    "General": ["Python", "SQL", "HTML", "CSS", "Teamwork"]
}

def analyze_resume(text, job_role):
    important_keywords = JOB_ROLE_SKILLS.get(job_role, [])
    found = []
    missing = []

    for keyword in important_keywords:
        if keyword.lower() in text.lower():
            found.append(keyword)
        else:
            missing.append(keyword)

    total_words = len(text.split())
    match_score = round((len(found) / len(important_keywords)) * 100) if important_keywords else 0

    return {
        "found_keywords": found,
        "missing_keywords": missing,
        "total_words": total_words,
        "match_score": match_score
    }

def get_ai_suggestions(text, found, missing, job_role):
    text_lower = text.lower()
    suggestions = []

    if "python" not in text_lower:
        suggestions.append("Consider adding Python to your skills section.")
    if "team" not in text_lower:
        suggestions.append("Mention team collaboration or teamwork experience.")
    if len(text.split()) < 100:
        suggestions.append("Your resume seems short. Try elaborating on your experience.")
    if len(found) < len(JOB_ROLE_SKILLS.get(job_role, [])) // 2:
        suggestions.append(f"To pursue a career in {job_role}, consider learning more of the required skills: {', '.join(missing)}")

    if not suggestions:
        return "✅ Your resume looks great! Just tailor it to the job description."
    return "📝 Suggestions:\n- " + "\n- ".join(suggestions)

@app.post("/upload")
async def upload_resume(file: UploadFile = File(...), job_role: str = Form(...)):
    file_bytes = await file.read()

    if file.filename.endswith(".pdf"):
        content = extract_text_from_pdf(file_bytes)
    elif file.filename.endswith(".docx"):
        content = extract_text_from_docx(file.file)
    else:
        return {"error": "Unsupported file type"}

    analysis = analyze_resume(content, job_role)
    ai_suggestions = get_ai_suggestions(content, analysis["found_keywords"], analysis["missing_keywords"], job_role)

    return {
        "text": content,
        "analysis": analysis,
        "suggestions": ai_suggestions
    }

