<div align="center">

# 🏠 ServiceBoard

### *Where Good Work Meets the Right People*

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20Site-orange?style=for-the-badge)](https://service-board-project.vercel.app/login)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)

<br/>

**ServiceBoard** is a full-stack, role-based marketplace that bridges the gap between **Homeowners** who need skilled help and trusted **Tradespeople** looking for reliable work — all in a single, beautifully designed platform.

<br/>

[🚀 Live Demo](https://service-board-project.vercel.app/login) · [📖 API Docs](#-api-reference)
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
| **Deployment** | Vercel (Frontend) · Render (Backend) | 

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

## 🧪 Test Cases

Use these test cases to manually verify all system functionalities. Test via the **Live Demo UI** or directly against the **API** using [Postman](https://postman.com) or `curl`.

> **Base URL (API):** `https://serviceboard-project.onrender.com/api`

---

### TC-01 · User Registration

| # | Scenario | Steps | Expected Result |
|---|---|---|---|
| 1.1 | Register as Homeowner | `POST /auth/register` with `role: "homeowner"`, valid name/email/password | `201` — Returns JWT token + user object |
| 1.2 | Register as Tradesperson | `POST /auth/register` with `role: "tradesperson"`, add `experience`, `hourlyRate`, `serviceArea`, `bio` | `201` — Returns JWT token + full profile |
| 1.3 | Duplicate email | Register with an already-used email | `400` — `"Email already registered"` |
| 1.4 | Missing required fields | Send request without `email` or `password` | `500` — Mongoose validation error |

---

### TC-02 · User Login

| # | Scenario | Steps | Expected Result |
|---|---|---|---|
| 2.1 | Valid login | `POST /auth/login` with correct email & password | `200` — Returns JWT token |
| 2.2 | Wrong password | `POST /auth/login` with incorrect password | `401` — `"Invalid credentials"` |
| 2.3 | Unknown email | `POST /auth/login` with unregistered email | `401` — `"Invalid credentials"` |
| 2.4 | UI redirect | Login successfully via `/login` page | Redirected to homepage; Navbar shows **My Jobs** + 🔔 bell |

---

### TC-03 · Job Posting (Homeowner only)

| # | Scenario | Steps | Expected Result |
|---|---|---|---|
| 3.1 | Post a valid job | Login as homeowner → click **Post Your Request** → fill all fields → submit | Job appears on homepage with `Open` badge |
| 3.2 | Tradesperson cannot post | Login as tradesperson → attempt `POST /jobs` with Bearer token | `403` — `"Only homeowners can post jobs"` |
| 3.3 | Missing required fields | Submit job form without title or description | Form validation prevents submission |
| 3.4 | Job appears on homepage | Post a job → visit homepage | New card visible with correct title, category, and date |

---

### TC-04 · Job Discovery & Search

| # | Scenario | Steps | Expected Result |
|---|---|---|---|
| 4.1 | Browse all jobs | Visit homepage without filters | All jobs displayed in grid |
| 4.2 | Filter by category | Select **Plumbing** from dropdown | Only Plumbing jobs shown |
| 4.3 | Keyword search | Type `tap` in search box | Only jobs with "tap" in title or description shown |
| 4.4 | Show only open jobs | Check **"Show Only Open Jobs"** | Jobs with `In Progress` or `Closed` status hidden |
| 4.5 | Combined filters | Select category + keyword search simultaneously | Results are filtered by both criteria |

---

### TC-05 · Job Application (Tradesperson only)

| # | Scenario | Steps | Expected Result |
|---|---|---|---|
| 5.1 | Apply to an open job | Login as tradesperson → open a job → write message → **Submit Application** | `201` — Success banner shown; button changes to "Applied" |
| 5.2 | Apply twice | Try to apply to the same job again | `400` — `"Application already submitted"` |
| 5.3 | Apply to assigned job | Apply to a job already *In Progress* | `400` — `"Applications are no longer accepted for this job"` |
| 5.4 | Homeowner cannot apply | Login as homeowner → attempt `POST /jobs/:id/apply` | `403` — `"Only tradespeople can apply"` |
| 5.5 | Notification sent | Tradesperson applies → login as homeowner | Notification bell shows new alert about the application |

---

### TC-06 · Reviewing & Hiring Applicants (Homeowner)

| # | Scenario | Steps | Expected Result |
|---|---|---|---|
| 6.1 | View applicants | Login as homeowner → My Jobs → click **Review Applicants** | List of candidate cards with profiles, stars, hourly rate |
| 6.2 | Approve an applicant | Click **Hire This Pro** → confirm in modal | Job status changes to `In Progress`; hired tradesperson is notified |
| 6.3 | Others auto-rejected | Approve one → check other applications | All other applicants' status set to `rejected` |
| 6.4 | Reject an applicant | Click **Decline** → confirm | Application marked rejected; tradesperson notified |
| 6.5 | Cannot hire after assignment | Job is *In Progress* → try to approve another applicant | `400` — `"Job is no longer open for approval"` |

---

### TC-07 · Job Status Updates (Tradesperson)

| # | Scenario | Steps | Expected Result |
|---|---|---|---|
| 7.1 | Update to In Progress | Login as assigned tradesperson → open job detail → change status dropdown | Job status updated to `In Progress` |
| 7.2 | Mark as Closed | Change status to `Closed` | Job marked Closed; homeowner receives completion notification; tradesperson's `completedJobs` count increments |
| 7.3 | Unassigned tradesperson blocked | Attempt `PATCH /jobs/:id` with a different tradesperson's token | `403` — `"Unauthorized: You are not assigned to this job"` |
| 7.4 | Homeowner cannot update status | Attempt `PATCH /jobs/:id` with homeowner token | `403` — `"Only tradespeople can update project status"` |

---

### TC-08 · Star Rating (Homeowner)

| # | Scenario | Steps | Expected Result |
|---|---|---|---|
| 8.1 | Rating card appears | Complete a job flow to *Closed* → login as homeowner → view job | Star rating panel visible at bottom of job detail page |
| 8.2 | Submit a rating | Hover stars → click 4 stars | Rating submitted; confirmation card shown; tradesperson notified |
| 8.3 | Cannot rate twice | Try to rate the same job again | `400` — `"You have already rated this job"` |
| 8.4 | Rating shows on profile | Submit rating → login as tradesperson → go to **Edit Profile** | Star display and numeric average updated with new rating |
| 8.5 | Rating on open job blocked | Attempt `POST /jobs/:id/rate` on an Open job | `400` — `"You can only rate a completed job"` |
| 8.6 | Running average | Submit ratings from multiple homeowners | Tradesperson's rating is a correct average (e.g. 4 + 5 = 4.5) |

---

### TC-09 · Notifications

| # | Scenario | Steps | Expected Result |
|---|---|---|---|
| 9.1 | Bell shows unread count | Trigger any event (apply, approve, etc.) | Orange pulsing dot with count appears on bell icon |
| 9.2 | Mark as read | Click an unread notification | Notification background lightens; dot disappears; count decrements |
| 9.3 | Clear all | Click **Clear All** in dropdown | All notifications removed; dropdown shows "All caught up!" |
| 9.4 | Bell hidden when logged out | View the site without logging in | Notification bell is not rendered |

---

### TC-10 · Job Deletion (Homeowner)

| # | Scenario | Steps | Expected Result |
|---|---|---|---|
| 10.1 | Delete an open job | Login as homeowner → open own job → click **Delete Request** → confirm | Job removed; redirected to homepage |
| 10.2 | Cannot delete active job | Attempt to delete a job with status *In Progress* or *Closed* | `400` — `"Cannot delete jobs that are active or completed"` |
| 10.3 | Non-creator blocked | Attempt `DELETE /jobs/:id` with a different homeowner's token | `403` — `"Unauthorized: Only the creator can delete this job"` |

---

### TC-11 · Edit Profile (Tradesperson)

| # | Scenario | Steps | Expected Result |
|---|---|---|---|
| 11.1 | Update profile | Login as tradesperson → **Edit Profile** → change hourly rate → Save | Success banner shown; data persisted in DB |
| 11.2 | LKR prefix shown | View hourly rate input | `LKR` pill prefix displayed inline, no overlap |
| 11.3 | Rating card on profile | View Edit Profile page | Star rating card shows current average and review count |
| 11.4 | Homeowner cannot access | Attempt to navigate to `/dashboard/tradesperson/profile` as homeowner | Redirected away (role-protected) |

---

### TC-12 · Security & Edge Cases

| # | Scenario | Steps | Expected Result |
|---|---|---|---|
| 12.1 | Access protected page without login | Navigate to `/dashboard/homeowner` directly | Redirected to `/login` |
| 12.2 | Expired / invalid token | Send request with a tampered JWT | `401` — `"Not authorized, token failed"` |
| 12.3 | No token on protected route | Call `GET /api/auth/profile` without Authorization header | `401` — `"Not authorized, no token"` |
| 12.4 | CORS from unknown origin | Call API from an unrelated domain | Request blocked at browser level |
| 12.5 | Password stored hashed | Register → query MongoDB directly | Password field is a bcrypt hash, never plain text |

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
