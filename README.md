# 🎓 Ucademy - Full Stack Learning Management System (LMS)

Ucademy is a modern, production-ready Learning Management System (LMS) built with **Next.js 15**, **TypeScript**, **Prisma**, and **Neon PostgreSQL**. It provides a seamless learning experience for students and a powerful dashboard for instructors/admins to create, manage, and sell courses.

> Built following an advanced full-stack architecture with authentication, payments, video streaming, analytics, and course management.

## 🚀 Live Demo

Coming Soon...

## 📷 Preview

> Add screenshots or GIFs here.

---

# ✨ Features

### 👨‍🎓 Student Features

- Secure Authentication
  - Email OTP Login
  - GitHub OAuth
- Browse Courses
- Purchase Courses using Stripe
- Watch Lessons with Custom Video Player
- Track Course Progress
- Mark Lessons as Completed
- Responsive Dashboard
- Rich Learning Experience

### 👨‍💼 Admin Features

- Admin Dashboard
- Create/Edit/Delete Courses
- Organize Lessons with Drag & Drop
- Upload Course Thumbnails
- Upload Videos using S3 Presigned URLs
- Rich Text Editor
- View Analytics
- Manage Students
- Track Course Sales

### 🔐 Security

- Better Auth Authentication
- Arcjet Security
- Rate Limiting
- XSS Protection
- SQL Injection Protection
- Secure Session Handling

---

# 🛠 Tech Stack

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Shadcn/UI
- React Hook Form
- Zod

### Backend

- Next.js Server Actions
- Prisma ORM
- Neon PostgreSQL

### Authentication

- Better Auth
- Email OTP
- GitHub OAuth

### Payments

- Stripe

### Storage

- AWS S3
- Presigned Upload URLs

### Security

- Arcjet
- Rate Limiting

### Deployment

- Vercel

---

# 📂 Project Structure

```
app/
components/
actions/
lib/
prisma/
public/
hooks/
types/
```

---

# ⚙️ Environment Variables

Create a `.env` file in the root directory.

```env
DATABASE_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
AWS_REGION=

ARCJET_KEY=
```

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/ICLIPTER/Ucademy.git
```

Go into the project directory

```bash
cd Ucademy
```

Install dependencies

```bash
npm install
```

Generate Prisma Client

```bash
npx prisma generate
```

Run database migrations

```bash
npx prisma migrate dev
```

Start the development server

```bash
npm run dev
```

Visit

```
http://localhost:3000
```

---

# 💳 Payments

Stripe is used for secure payment processing.

Configure:

- Stripe Secret Key
- Publishable Key
- Webhook Secret

before running the application.

---

# 📁 File Uploads

Ucademy uses **AWS S3 Presigned URLs** for secure uploads.

Supports:

- Course Images
- Lesson Videos

---

# 📊 Analytics

The dashboard provides:

- Total Revenue
- Total Sales
- Course Statistics
- Student Progress

---

# 🧩 Main Functionalities

- Authentication
- Authorization
- Course Creation
- Course Purchases
- Video Streaming
- Lesson Completion
- Progress Tracking
- Rich Text Editing
- Drag & Drop Lesson Ordering
- Admin Dashboard
- Customer Dashboard
- Analytics
- Secure File Uploads
- Stripe Checkout

---

# 🚀 Deployment

The project is optimized for deployment on **Vercel**.

Build the project

```bash
npm run build
```

Deploy using:

- Vercel

---

# 📌 Future Improvements

- Quiz System
- Certificates
- Instructor Profiles
- Course Reviews
- Wishlist
- Notifications
- Discussion Forum
- Multi-language Support
- Mobile App

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added feature"
```

4. Push your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Harshit**

GitHub: https://github.com/ICLIPTER

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub!

It motivates me to build more open-source projects.
