# Maths Exam Builder

A lightweight exam-building tool designed for tutors and teachers to generate GCSE-style maths exams. Select from a curated question bank and generate clean, printable PDFs using LaTeX formatting.

This project was born out of a real need I experienced as a maths tutor — I often wanted to create structured, exam-style papers for my students but couldn’t find a tool that was simple, fast, and free-to-use. So I built one. Now, I can generate tailored practice exams for my students in just a few clicks and I hope to scale it so teachers and educators across the UK can use it too.

---

## Features

- Select from a fixed set of GCSE-style maths questions
- Automatically compiles the selection into a structured LaTeX exam paper
- Generates downloadable PDFs for printing or digital use
- Simple, tutor-focused user interface

---

## Tech Stack

- Frontend: Next.js (App Router), TypeScript
- Backend: Node.js, Firebase Admin SDK (Base64 encoded)
- PDF Generation: LaTeX installed through Docker
- Deployment: Frontend on Vercel, Backend on Digital Ocean

---

## Planned Improvements

- Drag-and-drop question ordering
- Add custom questions manually
- Exam history and saving for logged-in users
- Deploy on AWS for cost-effective hosting
- Use Kubernetes for scalable container management

View the project on my portfolio: [tahmidchoudhury.uk/projects/exambuilder](https://tahmidchoudhury.uk/projects/exambuilder)
