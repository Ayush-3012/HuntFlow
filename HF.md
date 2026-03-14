# HuntFlow - One Page Project Summary

## 1) Objective
HuntFlow ka goal hai job hunt workflow ko centralize karna:
- Job tracking
- AI-tailored resume version generation
- Application lifecycle tracking
- Mail draft/send + recruiter replies capture
- Cold outreach message generation

## 2) Core Problem
Manual process fragmented hota hai (job links, resume versions, mails, statuses alag tools me).
HuntFlow ek unified pipeline deta hai: `Job -> Resume Tailoring -> Application -> Mail/Message -> Timeline -> Status updates`.

## 3) Tech Stack
- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Axios
- Backend: Node.js, Express 5, Mongoose
- DB: MongoDB
- AI: OpenRouter via custom AI client
- File/Storage: AWS S3 (generated resume PDFs)
- Email: SendGrid (+ inbound webhook)
- PDF: pdfkit (generation), pdfjs-dist (text extraction)

## 4) High-Level Workflow
1. User job + resume select karta hai (`/applications/new`).
2. Backend `POST /api/main/generate` trigger hota hai.
3. Base resume text fetch + extract hota hai.
4. AI JD ke hisaab se resume tailor karta hai.
5. Tailored PDF generate hoti hai aur S3 pe upload hoti hai.
6. New `ResumeVersion` + `Application` create hoti hai.
7. Recruiter email mila to AI mail draft create hoti hai.
8. AI cold message generate hota hai.
9. Timeline events store hote hain (application created, mail draft created, etc.).
10. User dashboard/detail page se status update/delete/manage karta hai.

## 5) Main Modules (Codebase Shape)
- Frontend pages: dashboard, jobs, resumes, mails, messages, applications
- API clients: `frontend/src/lib/api/*`
- Backend layers:
  - Routes: `job`, `resume`, `application`, `mail`, `message`, `webhook`, `main(generate)`
  - Controllers -> Services -> Models
  - Utilities: PDF extract, email extract, response formatter

## 6) Data Model (Core)
- `Job`: profile, company, JD, link, domain
- `Resume`: base resume entity
- `ResumeVersion`: versioned PDF URL per resume
- `Application`: job + resumeVersion + status
- `Mail`: draft/sent/failed + providerMessageId
- `ColdMessage`: outreach text per application
- `TimelineEvent`: activity log + payload

## 7) Current API Surface (Key)
- Jobs: `GET/POST /api/jobs`, `GET/PUT /api/jobs/:id`
- Resumes: `GET/POST /api/resumes`, `POST /api/resumes/resume-version`
- Applications: `GET/POST /api/applications`, `GET/DELETE /api/applications/:id`, `PUT /api/applications/:id/status`
- AI Generate: `POST /api/main/generate`
- Mails: `GET /api/mails`, `POST /api/mails/:id/send`, etc.
- Messages: `GET /api/messages`
- Webhook: `POST /webhooks/sendgrid/inbound`

## 8) Environment/Infra Requirements
- MongoDB URI
- SendGrid API key + sender email
- OpenRouter API key
- AWS region, bucket, access key, secret
- Frontend `NEXT_PUBLIC_API_URL`

## 9) Known Gaps / Risks
- Timeline route file exists but app routing me mount nahi hai (possible dead path).
- Status enum mismatch risk (`Interview` vs `Interviewed` type usage).
- Tests missing (backend script also indicates no test suite).
- CORS currently localhost-specific.

## 10) Near-Term Plan
- P0: enum consistency + timeline route mounting + error handling hardening
- P1: auth + multi-user separation
- P1: test coverage (service + API)
- P2: analytics (conversion funnel: Saved -> Applied -> Shortlisted -> Selected)

## 11) Success Metrics
- Time to generate tailored application
- Application-to-shortlist conversion rate
- Mail response rate
- Manual effort reduction per job applied
