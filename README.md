<div align="center">

# 🏠 ServiceBoard

### *Where Good Work Meets the Right People*

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20Site-orange?style=for-the-badge)](https://your-live-demo-url.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)

<br/>

**ServiceBoard** is a full-stack, role-based marketplace that bridges the gap between **Homeowners** who need skilled help and trusted **Tradespeople** looking for reliable work — all in a single, beautifully designed platform.

<br/>

[🚀 Live Demo](https://your-live-demo-url.vercel.app) · [📖 API Docs](#-api-reference) · [🐛 Report Bug](https://github.com/your-username/serviceboard/issues) · [💡 Request Feature](https://github.com/your-username/serviceboard/issues)

</div>


## ✨ Features at a Glance

<table>
<tr>
<td width="50%">

### 🏠 For Homeowners
- ✅ Post service requests in seconds
- ✅ Browse & compare tradesperson profiles
- ✅ Review proposals and hire with one click
- ✅ Rate completed work with 1–5 stars
- ✅ Manage all projects from one dashboard

</td>
<td width="50%">

### 🔧 For Tradespeople
- ✅ Discover and apply to local jobs
- ✅ Track application status in real-time
- ✅ Update job progress as work progresses
- ✅ Build a star-rated public reputation
- ✅ Edit professional profile from the top bar

</td>
</tr>
</table>

### 🌐 Platform-Wide
| Feature | Detail |
|---|---|
| 🔔 **Smart Notifications** | Instant alerts for approvals, rejections, ratings, and completions |
| 🔒 **Secure Auth** | JWT-based authentication with bcrypt password hashing |
| 📱 **Fully Responsive** | Seamless experience across mobile, tablet, and desktop |
| 🎨 **Premium Warm UI** | Custom orange/amber design system — no component libraries |
| 💬 **Custom Modals** | Zero native browser alerts — all confirmations use elegant modal dialogs |
| ⭐ **Live Star Ratings** | Running average rating system persisted in the database |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript 5, Tailwind CSS v4, Turbopack |
| **Backend** | Node.js 18+, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **Tooling** | ESLint, TypeScript Compiler |
| **Deployment** | Vercel (Frontend) · Railway / Render (Backend) |

---

## 📁 Project Structure

```
serviceboard/
│
├── 📂 backend/
│   ├── 📂 middleware/
│   │   └── auth.js                  # JWT protect middleware
│   ├── 📂 models/
│   │   ├── Application.js           # Job application schema
│   │   ├── JobRequest.js            # Job listing & rating flag schema
│   │   ├── Notification.js          # Notification schema
│   │   └── User.js                  # User profile + rating schema
│   ├── seed.js                      # Sample data seeder
│   ├── server.js                    # Express API & all routes
│   └── .env                         # ⚠️  Not committed — see setup
│
├── 📂 frontend/
│   └── 📂 src/
│       ├── 📂 app/
│       │   ├── 📂 dashboard/
│       │   │   ├── homeowner/       # Homeowner dashboard
│       │   │   └── tradesperson/
│       │   │       ├── page.tsx     # Tradesperson dashboard
│       │   │       └── profile/     # Edit profile + star rating view
│       │   ├── 📂 jobs/[id]/
│       │   │   ├── page.tsx         # Job detail, apply & rate
│       │   │   └── applicants/      # Review & hire applicants
│       │   ├── login/               # Sign in
│       │   ├── new/                 # Post a job
│       │   ├── register/            # Sign up
│       │   ├── layout.tsx           # Root layout + favicon + metadata
│       │   └── page.tsx             # Homepage — job discovery
│       ├── 📂 components/
│       │   ├── AuthProvider.tsx     # Route protection wrapper
│       │   ├── Navbar.tsx           # Sticky navigation bar
│       │   └── NotificationBell.tsx # Notification dropdown
│       └── 📂 utils/
│           └── ui-helpers.tsx       # Shared star & badge helpers
│
├── .gitignore
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://mongodb.com/) running locally **or** a free [Atlas](https://cloud.mongodb.com/) cluster

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/serviceboard.git
cd serviceboard
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a **`backend/.env`** file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/service-request-board
JWT_SECRET=your_super_secret_jwt_key_here
```

> 💡 **Optional:** Seed the database with sample jobs and users:
> ```bash
> node seed.js
> ```

Start the server:

```bash
node server.js
```
> ✅ Backend runs at **http://localhost:5000**

---

### 3. Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
```

Create a **`frontend/.env.local`** file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```
> ✅ Frontend runs at **http://localhost:3000**

---

## 📖 User Guide

### Homeowner Workflow
```
Register → Post a Request → Review Applicants → Hire a Pro → Rate the Work ⭐
```

1. Go to `/register` → select **Homeowner**
2. Click **"Post Your Request"** on the homepage
3. Navigate to **My Jobs** → click **"Review Applicants"**
4. Approve your preferred tradesperson
5. Once the job is **Closed**, a star rating card appears — rate the work!

### Tradesperson Workflow
```
Register → Browse Jobs → Apply → Get Approved → Complete the Job → Earn Stars ⭐
```

1. Go to `/register` → select **Tradesperson**
2. Browse the homepage; click a job to apply
3. Track progress in **My Jobs** dashboard
4. Open an approved job to move it from *In Progress* → *Closed*
5. Check your rating in **Edit Profile** (top navigation bar)

---

## 🔐 Business Rules

| Rule | Description |
|---|---|
| Role separation | Only homeowners post jobs; only tradespeople apply |
| One application per job | A tradesperson cannot apply to the same job twice |
| No deletion of active jobs | Jobs in *In Progress* or *Closed* status cannot be deleted |
| Single rating per job | A homeowner can only rate a completed job once |
| Tradesperson-only status updates | Only the assigned tradesperson can change job status |

---

## 🌐 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT token |
| `GET` | `/api/auth/profile` | ✅ | Fetch own profile (fresh from DB) |
| `PATCH` | `/api/auth/profile` | ✅ | Update own profile |

### Jobs
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/jobs` | ❌ | List all jobs (supports `category`, `status`, `search`) |
| `POST` | `/api/jobs` | ✅ | Create a job *(homeowner only)* |
| `GET` | `/api/jobs/:id` | ❌ | Get single job details |
| `PATCH` | `/api/jobs/:id` | ✅ | Update job status *(assigned tradesperson only)* |
| `DELETE` | `/api/jobs/:id` | ✅ | Delete a job *(homeowner, Open status only)* |
| `POST` | `/api/jobs/:id/apply` | ✅ | Apply to a job *(tradesperson only)* |
| `GET` | `/api/jobs/:id/applicants` | ✅ | View applicants *(homeowner only)* |
| `POST` | `/api/jobs/:id/rate` | ✅ | Rate a tradesperson *(homeowner, Closed jobs, once only)* |

### Applications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `PATCH` | `/api/applications/:id/approve` | ✅ | Approve an applicant |
| `PATCH` | `/api/applications/:id/reject` | ✅ | Reject an applicant |
| `GET` | `/api/tradesperson/my-applications` | ✅ | View own application history |

### Notifications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/notifications` | ✅ | Fetch own notifications |
| `PATCH` | `/api/notifications/:id/read` | ✅ | Mark a notification as read |
| `DELETE` | `/api/notifications` | ✅ | Clear all notifications |

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---


<div align="center">

Made with ❤️ and ☕ &nbsp;|&nbsp; Built for the community

⭐ **Star this repo if you found it useful!**

</div>
