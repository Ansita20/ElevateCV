# ResumeBuilder

ResumeBuilder is a full-stack AI-powered resume creation platform where users can create, edit, import, enhance, and share professional resumes with a live preview workflow.

## Project Description

ResumeBuilder helps users build ATS-friendly resumes quickly using guided forms and AI-assisted writing. It supports both creating resumes from scratch and uploading existing resumes for structured extraction.

The app provides a complete resume lifecycle:

1. User authentication (signup/login)
2. Resume dashboard with saved resume management
3. Builder with section-wise editing and live preview
4. AI enhancement for professional summary
5. Resume import and category-based extraction
6. Template and accent color customization
7. Public shareable preview links
8. Download/print-ready preview output

## Core Features

- Secure authentication with protected app routes
- Dashboard to create, open, rename, and delete resumes
- Resume builder sections:
  - Personal Information
  - Professional Summary
  - Experience
  - Education
  - Projects
  - Skills
- Real-time preview updates while editing
- Autosave of resume changes
- Upload existing resume and extract structured content
- AI-assisted summary enhancement with local fallback
- Optional image background removal support
- Public resume sharing and printable preview

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Redux Toolkit
- Tailwind CSS
- Axios
- React Hot Toast

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT authentication
- Multer (file handling)
- ImageKit integration
- Gemini SDK integration

## High-Level Flow

1. User logs in and enters the `/app` dashboard.
2. User creates a new resume or uploads an existing one.
3. Builder loads resume data and supports step-by-step editing.
4. Changes are saved and can be resumed later.
5. User can preview, share publicly, and print/download resume output.

## Why This Project

ResumeBuilder focuses on reducing friction in resume creation by combining:

- Structured data entry
- Real-time visual feedback
- AI-assisted improvements
- Persistent cloud-backed resume data

It is suitable for students, job seekers, and professionals who need quick, customizable, and modern resume workflows.
