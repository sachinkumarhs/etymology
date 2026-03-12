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

## Deployment Guide (Netlify Free Tier)

This app is configured to be deployed as a unified project on **Netlify**!
Because we use a Netlify Serverless Function for the backend, you do ***not*** need a separate Render deployment.

1. Create a new repo on [github.com](https://github.com) and push your code.
2. Connect your GitHub repository to Netlify.
3. Netlify will automatically detect the settings in `netlify.toml` and build the app.
4. Your Express backend will run as a Netlify Function!

### 🔑 Setting up the API Key in Netlify
Because this app relies on the Google Gemini AI, you must configure your API Key within Netlify.
1. In your Netlify dashboard, go to your Site settings.
2. Navigate to **Site configuration > Environment variables**.
3. Add a new variable:
   - Key: `GEMINI_API_KEY`
   - Value: `(Your actual Gemini API key)`
4. Save and trigger a new deployment.

---

## Tech Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **AI:** Google Gemini API (gemini-2.5-flash)
- **Translation:** MyMemory API (free, no key needed)
- **Transliteration:** Aksharamukha API (free)
