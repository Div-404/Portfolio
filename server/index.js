const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3007;

app.use(cors());
app.use(express.json());

// Serve Angular build
app.use(express.static(path.join(__dirname, '..', 'dist', 'portfolio', 'browser')));

// ─── API Routes ───────────────────────────────────────────────────────────────

app.get('/api/portfolio', (req, res) => {
  res.json({
    name: 'Shivam Kumar Divaker',
    title: 'Full Stack Software Engineer',
    location: 'Noida, India',
    email: 'arjundivaker8@gmail.com',
    phone: '+91 63923 72109',
    linkedin: 'https://linkedin.com/in/shivam-kumar-divakar-30b567137',
    github: 'https://github.com/Div-404',
    experience: '4+ Years',
    tagline: "I engineer systems that move data, money, and decisions."
  });
});

app.get('/api/timeline', (req, res) => {
  res.json([
    {
      id: 1,
      period: 'Jun 2025 – Present',
      company: 'Marketwick Pvt. Ltd.',
      role: 'Software Engineer — Full Stack',
      location: 'Ghaziabad',
      description: 'Architected BBPS payment microservices across 7+ vendors with idempotency guarantees. Built auto-settlement engine, Slack ops alerting, Angular modular re-architecture pushing Lighthouse 68→85.',
      tech: ['Angular', 'React', 'Node.js', 'TypeScript', 'SQL Server', 'Microservices'],
      metrics: ['90% less manual work', '35% fewer failed txns', 'Lighthouse 68→85']
    },
    {
      id: 2,
      period: 'Jan 2023 – Feb 2025',
      company: 'Acro Technologies',
      role: 'Software Engineer — Angular Developer',
      location: 'Noida',
      description: 'Built 10+ Angular modules adopted across 5 product lines. Led CRM modernization from legacy .NET WebForms to modular Angular with 30+ reusable components. WCAG 2.1, RxJS reactive patterns.',
      tech: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Angular Material'],
      metrics: ['25% delivery velocity ↑', '20% fewer defects', '30+ reusable components']
    },
    {
      id: 3,
      period: 'Jan 2022 – Jan 2023',
      company: 'Acro Technologies',
      role: 'Associate Software Engineer — .NET Developer',
      location: 'Noida',
      description: 'Started career building enterprise CRM solutions. 20+ .NET WebForms enhancements, complex SQL queries and stored procedures.',
      tech: ['.NET', 'C#', 'SQL Server', 'HTML', 'CSS', 'JavaScript'],
      metrics: ['DB response -10%', 'Client satisfaction +30%']
    }
  ]);
});

app.get('/api/skills', (req, res) => {
  res.json({
    frontend: [
      { name: 'Angular', level: 95, detail: 'v12–v19 · Primary' },
      { name: 'TypeScript', level: 92, detail: 'ES6+ · Strict' },
      { name: 'RxJS', level: 88, detail: 'Reactive · OnPush' },
      { name: 'React', level: 60, detail: 'Growing' },
      { name: 'Angular Material', level: 85, detail: 'Highcharts · SCSS' }
    ],
    backend: [
      { name: 'Node.js', level: 88, detail: 'Express · Microservices' },
      { name: '.NET / C#', level: 80, detail: 'WebForms · REST' },
      { name: 'REST APIs', level: 90, detail: 'Design · Webhooks' }
    ],
    data: [
      { name: 'SQL Server', level: 83, detail: 'Complex · Stored Procs' },
      { name: 'BBPS', level: 92, detail: '7+ Vendors' },
      { name: 'Razorpay/Stripe', level: 78, detail: 'Gateway · Payout' }
    ],
    tools: [
      { name: 'Git / JIRA', level: 86, detail: 'CI/CD Basics' },
      { name: 'Slack API', level: 80, detail: 'Bots · Webhooks' },
      { name: 'WebSockets', level: 75, detail: '1000+ evts/sec' }
    ]
  });
});

app.get('/api/projects', (req, res) => {
  res.json([
    {
      id: 1, category: 'payments',
      title: 'BBPS Multi-Vendor Payment & Auto-Settlement Engine',
      description: 'Unified abstraction across 7 BBPS vendors with idempotency keys, retry-with-backoff, and cron-based auto-settlement. Zero missed settlements.',
      tech: ['Node.js', 'Express', 'node-cron', 'REST', 'SQL Server'],
      impact: '↓ 90% less manual work · 35% fewer failed txns'
    },
    {
      id: 2, category: 'automation',
      title: 'Slack Operations & Notification Platform',
      description: 'Event-driven alerting for settlement failures, gateway timeouts, and transaction anomalies. Self-service workflows for ops.',
      tech: ['Node.js', 'Slack API', 'Webhooks', 'Event-Driven'],
      impact: '↓ Real-time response · Zero missed alerts'
    },
    {
      id: 3, category: 'realtime',
      title: 'MT5 Real-Time Trading Dashboard',
      description: 'Live market data at 1000+ data points/sec via WebSockets. Angular OnPush, Highcharts streaming charts.',
      tech: ['Angular', 'WebSockets', 'Highcharts', 'TypeScript'],
      impact: '↓ 1000+ events/sec · 20% fewer chart errors'
    },
    {
      id: 4, category: 'enterprise',
      title: 'XRM CRM Platform Modernization',
      description: 'Legacy enterprise CRM → modular Angular + REST. 30+ reusable components, WCAG 2.1, 30% load time reduction.',
      tech: ['Angular', '.NET', 'C#', 'SQL Server', 'REST'],
      impact: '↓ 30% load time · 30+ components · 4 teams'
    }
  ]);
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log(`Contact: ${name} (${email}) - ${message}`);
  res.json({ success: true, message: 'Message received!' });
});

// ─── AI Chatbot (NVIDIA NIM) ──────────────────────────────────────────────────
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

const SYSTEM_PROMPT = `You are Shivam's AI portfolio assistant. You answer questions about Shivam Kumar Divaker concisely and helpfully.

About Shivam:
- Full Stack Software Engineer with 4+ years experience
- Currently at Marketwick Pvt. Ltd. (Jun 2025–Present) as Software Engineer — Full Stack, Ghaziabad
- Previously at Acro Technologies (Jan 2022 – Feb 2025), rose from Associate to Software Engineer
- Email: arjundivaker8@gmail.com | Phone: +91 63923 72109 | Location: Noida, India
- LinkedIn: linkedin.com/in/shivam-kumar-divakar-30b567137 | GitHub: github.com/Div-404

Skills: Angular (v12-v19, 95%), TypeScript (92%), RxJS (88%), Node.js (88%), REST APIs (90%), .NET/C# (80%), SQL Server (83%), BBPS (92%), React (60%), Slack API, WebSockets, Git/JIRA

Key Projects:
1. BBPS Multi-Vendor Payment Engine — 7+ vendors, 90% manual work reduction, 35% fewer failed transactions
2. Slack Operations Platform — real-time alerting, zero missed alerts
3. MT5 Real-Time Trading Dashboard — 1000+ data points/sec via WebSockets, Highcharts
4. XRM CRM Modernization — 30+ Angular components, 30% load time reduction

Currently Learning: Claude 101, AI Fluency: Framework & Foundations

Keep answers short (2-4 sentences). Be friendly and professional. If asked something unrelated to Shivam, politely redirect.`;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-8b-instruct',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('NVIDIA API error:', data);
      return res.status(500).json({ error: 'AI service error', detail: data });
    }
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to reach AI service' });
  }
});

// ─── GitHub proxy (avoid CORS on client) ─────────────────────────────────────
app.get('/api/github', async (req, res) => {
  try {
    const response = await fetch('https://api.github.com/users/Div-404/repos?per_page=6&sort=updated', {
      headers: { 'User-Agent': 'portfolio-app' }
    });
    const repos = await response.json();
    res.json(repos);
  } catch (err) {
    res.status(500).json({ error: 'GitHub fetch failed' });
  }
});

// Fallback to Angular
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'portfolio', 'browser', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Portfolio server running on http://localhost:${PORT}`);
});
