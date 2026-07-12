# Portfolio Setup Guide

## 1. Install dependencies
```bash
npm install
```

## 2. Set your NVIDIA API Key

**Option A — Environment variable (recommended):**
```bash
# Windows PowerShell
$env:NVIDIA_API_KEY="your-nvapi-key-here"
npm run dev

# Windows CMD
set NVIDIA_API_KEY=your-nvapi-key-here
npm run dev
```

**Option B — Edit directly in server/index.js line 5:**
```js
const NVIDIA_API_KEY = 'nvapi-xxxxxxxxxx';
```

## 3. Run
```bash
npm run dev
```

Open http://localhost:3000

## What's included
- Hero section (text left, avatar right, hover to switch images)
- About timeline (fetches from /api/timeline)
- Projects grid
- Skills matrix with animated bars
- Learning section (Claude 101, AI Fluency) + GitHub stats
- Contact form (posts to /api/contact)
- AI Chatbot (floating button, powered by NVIDIA NIM / Llama 3.1)
