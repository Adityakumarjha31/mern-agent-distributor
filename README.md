# MERN Agent Distributor

A simple **MERN** (MongoDB, Express, React/Next.js, Node.js) application to manage agents and distribute contact lists evenly across agents. This README explains setup, configuration, features, endpoints, CSV format and the distribution algorithm.

---

## 🔎 Project Overview

This project implements:

* User authentication (email/password) using **JWT**.
* Admin dashboard (protected) to add agents and upload contact lists via CSV/XLSX/XLS.
* Validation of uploaded files and CSV structure.
* Even distribution of uploaded list items across 5 agents (remaining items distributed sequentially).
* Storage of users, agents and distributed lists in **MongoDB**.

---

## ✅ Features

* Login (email + password). On success: redirect to dashboard; on failure: show a meaningful error message.
* Add agents: name, email, mobile (with country code), password.
* Upload CSV / Excel (.csv, .xlsx, .xls) containing `FirstName`, `Phone`, `Notes`.
* Validate file type and CSV columns.
* Distribute items equally across 5 agents and save distributions in MongoDB.
* Frontend UI to view distributed lists per agent.

---

## 📁 Example Project Structure

```
mern-agent-distributor/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── pages/ (or src/)
│   ├── components/
│   ├── services/
│   ├── package.json
│   └── next.config.js (if Next.js)
├── .gitignore
└── README.md
```

---

## 🛠 Prerequisites

* Node.js (v16+ recommended)
* npm or yarn
* MongoDB URI (Atlas or local)
* Optional: `ffmpeg` / screen recorder for demo video

---

## ⚙ Environment Variables

Create a `.env` file in the `backend` folder. Example `.env`:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/agent_distributor?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

> **DO NOT** commit your real `.env` to GitHub. Provide a `.env.example` instead.

---

## 🧭 Installation & Run (Local)

### Backend

```bash
cd backend
npm install
# for development (with nodemon)
npm run dev
# or production
npm start
```

Typical `package.json` scripts (backend):

```json
"scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js"
}
```

### Frontend (React or Next.js)

```bash
cd frontend
npm install
# development
npm run dev
# or for create-react-app
npm start
# build for production
npm run build
```

---

## 📦 API Endpoints (Example)

> Base: `http://localhost:5000/api`

### Auth

* `POST /api/auth/register` — (Optional) create a user

  * Body: `{ name, email, password }`
* `POST /api/auth/login` — authenticate

  * Body: `{ email, password }`
  * Response: `{ token, user }` (set token in `Authorization: Bearer <token>` header)

### Agents

* `POST /api/agents` — Create an agent (protected)

  * Body: `{ name, email, phone, password }`
* `GET /api/agents` — List agents (protected)

### Upload & Distribution

* `POST /api/lists/upload` — Upload CSV/XLSX/XLS (protected)

  * Accepts multipart/form-data with a file field, e.g. `file`.
  * Validates file extension and parses rows.
  * Validates columns: `FirstName`, `Phone`, `Notes`.
  * Distributes rows across 5 agents and saves distributions.
  * Response: summary of distribution and IDs.

* `GET /api/lists/agent/:agentId` — Get distributed items for a specific agent (protected)

---

## 🧪 CSV / Excel Format & Validation

**Accepted file extensions:** `.csv`, `.xlsx`, `.xls`.

**Required columns (header row):**

* `FirstName` — text (string)
* `Phone` — number or string (include country code if possible)
* `Notes` — text (string, optional)

**Validation steps:**

1. Check file extension; reject if not one of the allowed types.
2. Parse file (use `csv-parse`, `papaparse` or `xlsx` for Excel).
3. Ensure header row contains `FirstName`, `Phone`, `Notes` (case‑insensitive match is recommended).
4. Validate each row: `Phone` should be non-empty (optionally numeric), `FirstName` non-empty.
5. If any row fails validation, return a helpful error showing the row number(s).

---

## ⚖️ Distribution Algorithm

**Goal:** distribute uploaded items as evenly as possible across 5 agents.

Algorithm (simple deterministic approach):

1. Let `N` be the number of valid items.
2. `base = Math.floor(N / 5)` — how many each agent gets at minimum.
3. `remainder = N % 5` — remaining items.
4. For agents with index `0..4`, give `base` items each.
5. For the first `remainder` agents (0 to remainder-1), give one additional item each, assigned sequentially.

**Example:** N = 27

* base = 5
* remainder = 2
* Distribution: [6, 6, 5, 5, 5]

**Assignment order:** keep original CSV order when assigning so items remain deterministic.

---

## 🗄 Suggested MongoDB Schemas (Mongoose)

### User

```js
{
  name: String,
  email: { type: String, unique: true },
  password: String, // hashed
  role: { type: String, default: 'admin' }
}
```

### Agent

```js
{
  name: String,
  email: String,
  phone: String,
  password: String // hashed
}
```

### ListItem

```js
{
  firstName: String,
  phone: String,
  notes: String,
  originalIndex: Number
}
```

### DistributedList (per agent)

```js
{
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ListItem' }],
  uploadedAt: Date
}
```

---

## 🔐 Authentication (JWT)

* On login, create a signed JWT with `JWT_SECRET` and a sensible expiry (`JWT_EXPIRES_IN`).
* Protect routes using middleware that verifies `Authorization: Bearer <token>`.
* On token validation success, attach `req.user` and proceed.

---

## 🧾 Frontend Notes

* Login form: validate client-side before sending `POST /api/auth/login`.
* After successful login, store token in `localStorage` or an httpOnly cookie (httpOnly is safer).
* Redirect to `/dashboard` after login.
* Dashboard should show: list of agents, `Add Agent` form, `Upload CSV` form, and agent-wise distributed lists.
* Display clear error messages returned from API (e.g., invalid CSV rows, invalid credentials, server errors).

---

## 🧰 Libraries & Tools Recommendations

* Backend: `express`, `mongoose`, `bcryptjs` (or `bcrypt`), `jsonwebtoken`, `multer` (file upload), `csv-parse` or `papaparse` or `xlsx`.
* Frontend: `react` or `next`, `axios` or `fetch`, `react-hook-form` for forms (optional).
* Validation: `joi` or `express-validator` (backend) and `yup` + `react-hook-form` (frontend).

---

## ✅ How to Deliver (for evaluation)

1. **Source code** — push full code to GitHub repository.
2. **README** — include setup and execution instructions (this file).
3. **Video demo** — record a short screen-capture showing:

   * Login flow (success + failure)
   * Add agents
   * Upload a small CSV (e.g., 12 rows) and show distribution
   * Show distributed lists for agents
   * Show MongoDB entries (optional)

Upload the video to Google Drive and include a **shareable link** in the repo README.

---

## 🐞 Troubleshooting

* If `npm run dev` fails: check node version, ensure `.env` configured, check DB connectivity.
* If uploads fail: verify `multer` limits and middleware, ensure the frontend sends `multipart/form-data`.
* If CSV parsing fails: open file to confirm headers; some editors add BOM; trim and normalize header names.

---

## 📎 Example CSV (first line = header)

```
FirstName,Phone,Notes
John,+919876543210,Called earlier
Priya,+919812345678,Important
... (more rows)
```

---

## 📜 Licensing

This project is open source — add a LICENSE file (MIT recommended) if you want others to reuse it.

---

## ✍️ Final Notes

If you want, I can:

* Generate a ready-to-paste `.env.example`, `.gitignore`, and Mongoose models.
* Create sample backend routes and controllers for auth, agent CRUD, and CSV upload/distribution.
* Produce a short script to generate a sample CSV (for testing).

Tell me which follow-up you'd like and I’ll create the code and files.
