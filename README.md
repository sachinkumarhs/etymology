# Pada Moola — Linguistic Roots & Etymology Explorer

An app to explore the etymology of English, Sanskrit, and Kannada words. Powered by Gemini AI.

---

## Local Development

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Add your GEMINI_API_KEY to .env
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Deployment Guide (Free Tier)

### Step 1 — Push to GitHub
1. Create a new repo on [github.com](https://github.com)
2. Push this folder:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/pada-moola
git push -u origin main
```

### Step 2 — Deploy Backend to Render
1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo → Select the **`backend/`** folder
3. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add Environment Variable:
   - `GEMINI_API_KEY` = your key from [aistudio.google.com](https://aistudio.google.com)
5. Deploy → Copy the live URL (e.g. `https://pada-moola-backend.onrender.com`)

### Step 3 — Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo → Set **Root Directory** to `frontend`
3. Add Environment Variable:
   - `VITE_API_URL` = `https://pada-moola-backend.onrender.com/api`
4. Deploy → Your app is live! 🎉

---

## Tech Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **AI:** Google Gemini API (gemini-2.5-flash)
- **Translation:** MyMemory API (free, no key needed)
- **Transliteration:** Aksharamukha API (free)
