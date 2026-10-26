# IMS – Institution Management System
### by ZENTRYX

Pitch-ready mobile demo for coaching institutes.

## Features
- All 5 roles (Admin, Teacher, Parent, Student, Super Admin)
- English + Hindi toggle
- Offline attendance
- Premium Teacher Attendance UI
- WhatsApp Fee Reminders (one-tap)
- Daily Snapshot (shareable report)
- Role switcher for demos
- PWA-ready (Add to Home Screen)

---

## Deploy to Vercel (get a public link)

### Method 1 – Easiest (recommended)

1. Go to [https://vercel.com](https://vercel.com) and sign up / log in (GitHub account is fine)
2. Click **Add New Project**
3. If you have the code on GitHub:
   - Push this folder to a GitHub repo
   - Import the repo in Vercel
4. If you do **not** use GitHub:
   - Install Vercel CLI: `npm i -g vercel`
   - In this folder run: `vercel`
   - Follow the prompts (accept defaults)
5. After deploy you get a link like:  
   `https://ims-zentryx.vercel.app`

### Method 2 – Drag & drop (no code)

1. On your computer run:
   ```bash
   cd ims-project
   npm install
   npm run build
   ```
2. Go to [https://vercel.com/new](https://vercel.com/new)
3. Drag the **`dist`** folder onto the page
4. You get a public URL instantly

---

## Run locally

```bash
cd ims-project
npm install
npm run dev
```

Open http://localhost:3000 on your phone (same Wi-Fi) or laptop.

---

## Pitch flow

| Step | Role | Show |
|------|------|------|
| 1 | Teacher | Premium Attendance (works offline) |
| 2 | Admin | WhatsApp Fee Reminders + Daily Snapshot |
| 3 | Parent | Fees + child progress |
| 4 | Student | Timetable, homework, results |

---

**Product**: IMS  
**Company**: ZENTRYX
