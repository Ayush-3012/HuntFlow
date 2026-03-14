# 🚀 HuntFlow

**HuntFlow** is an AI-powered job application workflow platform that
helps developers streamline their job hunt by automating resume
tailoring, application tracking, and recruiter communication.

The platform centralizes the entire job hunting pipeline --- from saving
jobs to generating AI-tailored resumes and managing recruiter
interactions.

------------------------------------------------------------------------

# 🎯 Objective

Job hunting usually involves many disconnected tools:

-   Job links saved in different places
-   Multiple resume versions
-   Manual email outreach
-   Tracking application status in spreadsheets

**HuntFlow solves this by providing a unified pipeline:**

    Job → Resume Tailoring → Application → Email / Message → Timeline → Status Tracking

------------------------------------------------------------------------

# ✨ Core Features

### 🤖 AI Resume Tailoring

Automatically generates **customized resume versions** based on job
descriptions using AI.

### 📄 Resume Versioning

-   Maintain multiple tailored resume versions
-   Each application is linked to a specific resume version

### 📬 Email Automation

-   AI-generated recruiter emails
-   Send emails directly from the platform
-   Track email status (draft / sent / failed)

### 📊 Application Tracking

Track the full lifecycle of job applications:

    Saved → Applied → Shortlisted → Interview → Offer → Rejected

### 🕒 Activity Timeline

Each application includes a timeline of events:

-   Resume generated
-   Application created
-   Email drafted
-   Recruiter replied
-   Status updates

### 💬 Cold Outreach Messages

Generate personalized cold messages for recruiters using AI.

------------------------------------------------------------------------

# 🧱 Tech Stack

## Frontend

-   **Next.js**
-   **React**
-   **TypeScript**
-   **Tailwind CSS**
-   **Axios**
-   **CLSX**
-   **Framer-Motion**

## Backend

-   **Node.js**
-   **Express.js**
-   **Mongoose**
-   **NodeMailer**
-   **Zod**
-   **Pdfkit**
-   **pdfjs-dist**

## Database

-   **MongoDB**

## AI Integration

-   **OpenRouter API**

## File Storage

-   **AWS S3** for storing generated resume PDFs

## Email System

-   **SMTP MAIL**

## PDF Processing

-   **PDFKit** (resume generation)
-   **pdfjs-dist** (text extraction)

------------------------------------------------------------------------

# 🏗️ System Architecture

    User
     ↓
    Next.js Frontend (Vercel)
     ↓
    Express Backend API (Render)
     ↓
    MongoDB Database
     ↓
    AWS S3 (Resume Storage)
     ↓
    SendGrid (Email Automation)
     ↓
    OpenRouter AI (Resume + Message Generation)

------------------------------------------------------------------------

# ⚙️ Core Workflow
0.  User creates job by filling job profile, company name, job description.
1.  User selects a **Job + Base Resume**
2.  Backend triggers the AI generation pipeline
3.  Resume text is extracted and analyzed
4.  AI generates a tailored resume version based on job description.
5.  A PDF resume is created and uploaded to **AWS S3**
6.  A new **ResumeVersion** and **Application** record is created
7.  AI drafts recruiter outreach emails
8.  Application events are logged in the **timeline**
9.  Users track and manage applications from the dashboard

------------------------------------------------------------------------

# 📦 Key Modules

## Jobs

Store job postings with company, role, job description, and link.

## Resumes

Manage base resumes and their tailored versions.

## Applications

Track job applications and status updates.

## Mail

Manage recruiter communication and email sending.

## Messages

Generate and store cold outreach messages.

## Timeline Events

Track all application-related activities.

------------------------------------------------------------------------

# 📡 API Endpoints (Core)

### Jobs

    GET    /api/jobs
    POST   /api/jobs
    GET    /api/jobs/:id
    PUT    /api/jobs/:id

### Resumes

    GET    /api/resumes
    POST   /api/resumes
    POST   /api/resumes/resume-version

### Applications

    GET    /api/applications
    POST   /api/applications
    GET    /api/applications/:id
    DELETE /api/applications/:id
    PUT    /api/applications/:id/status

### AI Generation

    POST /api/main/generate

### Mail

    GET  /api/mails
    POST /api/mails/:id/send

------------------------------------------------------------------------

# 🚀 Deployment

### Frontend

Hosted on **Vercel**

### Backend

Hosted on **Render**

### Database

**MongoDB Atlas**

### Storage

**AWS S3**

------------------------------------------------------------------------

# 🔐 Environment Variables

Example `.env` configuration:

    MONGO_URI=
    OPENROUTER_API_KEY=
    SENDGRID_API_KEY=
    SENDGRID_SENDER_EMAIL=

    AWS_ACCESS_KEY_ID=
    AWS_SECRET_ACCESS_KEY=
    AWS_BUCKET_NAME=
    AWS_REGION=

    NEXT_PUBLIC_API_URL=

------------------------------------------------------------------------

# 📊 Future Improvements

-   Multi-user authentication system
-   Application analytics dashboard
-   Browser extension for saving jobs
-   AI cover letter generation
-   Recruiter CRM features

------------------------------------------------------------------------

# 👨‍💻 Author

**Ayush Kumar**\
Full-Stack Developer

GitHub: https://github.com/Ayush-3012
