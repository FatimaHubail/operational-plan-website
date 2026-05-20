# Link React frontend to opt-plan-backend (login + admin users)

Follow these steps in order. Check each box when done.

## Prerequisites

1. **MongoDB** — `DATABASE_URI` in `opt-plan-backend/.env`
2. **Backend env** — copy `opt-plan-backend/.env.example` → `.env` and set:
   - `CLIENT_ORIGIN=http://localhost:5173` (must match your Vite port)
   - `JWT_ACCESS_SECRET`, `DATABASE_URI`, SMTP vars if sending invites
3. **Seed admin** (once):

```bash
cd opt-plan-backend
node scripts/seedAdmin.js
```

Default login: `admin@uob.edu.bh` / `Admin-Test-123!`

4. **Run API**:

```bash
cd opt-plan-backend
npm run dev
```

API listens on `http://localhost:5000`.

---

## Step 1 — API client (cookies)

| File | Purpose |
|------|---------|
| `src/lib/api.ts` | `fetch` wrapper with `credentials: "include"` |

Dev: leave `VITE_API_BASE` empty (see `.env.example`). Requests go to `/api/...` on the Vite origin and are proxied to port 5000.

---

## Step 2 — Auth API + context

| File | Purpose |
|------|---------|
| `src/lib/authApi.ts` | `login`, `fetchMe`, `logout`, `changePassword` |
| `src/context/AuthContext.tsx` | On mount: `fetchMe()`; exposes `user`, `loading`, `login()`, `logout()` |
| `src/main.tsx` | Wrap `<App />` with `<AuthProvider>` |

---

## Step 3 — Vite proxy

| File | Purpose |
|------|---------|
| `vite.config.ts` | `server.proxy["/api"]` → `http://localhost:5000` |

Restart Vite after changing proxy or env.

---

## Step 4 — Login page → `/api/auth/login`

| File | Route | API |
|------|-------|-----|
| `src/routes/Login.tsx` | `/login` | `POST /api/auth/login` via `login()` |

On success → `navigate(homeForRole(user.role))` or `/change-password` if `mustChangePassword`.

On error → show `err.message` in the red banner.

---

## Step 5 — Change password → `/api/auth/change-password`

| File | Route | API |
|------|-------|-----|
| `src/routes/ChangePassword.tsx` | `/change-password` | `POST /api/auth/change-password` |

Public route (not inside `RequireAuth`). Logged-in users with `mustChangePassword` are sent here by the guard.

---

## Step 6 — Protect app routes

| File | Purpose |
|------|---------|
| `src/components/RequireAuth.tsx` | Spinner → redirect `/login` → role check → `<Outlet />` |
| `src/App.tsx` | Wrap layout routes with `<RequireAuth>` + `<AppLayout>` |
| Admin-only | `<RequireAuth allowedRoles={["administrator"]} />` on `/users`, `/add-user` |

| Page | Path | Guard |
|------|------|-------|
| Dashboard | `/dashboard` | Any authenticated user |
| Users list | `/users` | Administrator only |
| Add user | `/add-user` | Administrator only |

---

## Step 7 — Admin users API

| File | Purpose |
|------|---------|
| `src/lib/usersApi.ts` | `listUsers`, `createUser`, `updateUser`, `deleteUser`, `sendInvite`, `resendInvite` |
| `src/routes/admin/AdminUsers.tsx` | `GET /api/users` on load; PATCH/DELETE in manage dialog |
| `src/routes/admin/AddUser.tsx` | `POST /api/users` on submit |

Role values in forms: `admin`, `auditor`, `contributor`, `owner` (backend `mapRole` converts them).

---

## Step 8 — Run both apps

```bash
# Terminal 1
cd opt-plan-backend && npm run dev

# Terminal 2
cd operational-plan-website && npm run dev
```

Open `http://localhost:5173/login`.

---

## Quick test checklist

1. Login as seed admin → lands on `/dashboard`
2. Open `/users` → table loads from API
3. Add user → returns to `/users` with new row
4. Logout (sidebar) → back to `/login`
5. Wrong password → API error message on login form

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Login 401 / cookie not kept | `CLIENT_ORIGIN` must match Vite URL exactly; use proxy (empty `VITE_API_BASE`) |
| CORS error | Backend `CLIENT_ORIGIN` wrong or missing `credentials: true` (already in `server.js`) |
| Admin pages 403 | Log in as `administrator` role |
| Invite email fails | Configure SMTP in backend `.env` or turn off “Send invitation email” on Add user |
