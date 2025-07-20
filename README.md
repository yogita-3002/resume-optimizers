# 📄 AI-Powered Resume Optimizer

This is a web-based resume analysis tool that helps job seekers improve their resumes by matching them with role-specific skill requirements and providing smart suggestions for improvement.

## 🚀 Features

- ✅ Upload resume (PDF or DOCX)
- 🔍 Extract and analyze resume content
- 📊 Visualize found vs. missing skills using bar charts
- 🧠 AI-style suggestions (offline logic, no OpenAI required)
- 🎯 Match score calculation based on job role
- 🔁 Role selector for personalized recommendations
- 🌐 Built with FastAPI (backend) and React (frontend)

## 📁 File Upload and Analysis

- Users can upload their resume file (PDF/DOCX)
- Backend extracts the text from the resume
- Analyzes:
  - Found skills
  - Missing skills
  - Total word count
  - Resume match score (%)

## 🧠 AI Suggestions (Offline)

Smart suggestions are generated using offline logic based on the resume content, including:
- Highlighting missing job-specific keywords
- Warning for low word count
- Recommending soft skills if absent

> ⚠️ No OpenAI API is used — all logic is handled locally in the backend.

## 🧰 Tech Stack

**Frontend:**
- React
- Recharts (for skill visualization)

**Backend:**
- FastAPI
- PyMuPDF (PDF text extraction)
- python-docx (DOCX text extraction)

## 🧑‍💼 Supported Job Roles

You can analyze your resume against specific job profiles:
- Frontend Developer
- Backend Developer
- Full Stack Developer
- Data Analyst
- Machine Learning Engineer
- DevOps Engineer
- General (default)

## 📦 How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/your-username/resume-optimizer.git
cd resume-optimizer

2. Start the Backend (FastAPI)
cd backend
pip install fastapi uvicorn python-docx pymupdf python-multipart
uvicorn main:app --reload

3. Start the Frontend (React)
cd frontend
npm install
npm start
Make sure the backend is running at http://127.0.0.1:8000.

✅ Sample Output
📄 Resume Text:
John Doe is a software developer with experience in Python and FastAPI.

✅ Found Skills: Python, FastAPI
❌ Missing Skills: Machine Learning, React, SQL
📝 Total Words: 15
📊 Match Score: 40%

💡 AI Suggestions:
- Consider adding more job-relevant keywords.
- Resume is too short. Add more details.
- Soft skills like "teamwork" or "communication" are missing.
