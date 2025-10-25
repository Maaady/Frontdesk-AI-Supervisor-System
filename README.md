# Frontdesk AI Supervisor

A lightweight, production-ready system for managing **AI receptionist escalations** with **human supervision** and **automatic learning**.

## 🚀 Overview

This project simulates an AI receptionist that handles customer questions for a salon. Unknown queries are escalated to a human supervisor, whose responses automatically update the knowledge base for future use.

## ✨ Features

* AI Agent Simulator — answers known questions or escalates unknown ones
* Supervisor Dashboard — view, respond, and resolve pending requests
* Knowledge Base — automatically learns from supervisor answers
* Timeout Handling — unresolved requests expire automatically

## 🧠 Tech Stack

* **Frontend:** React + TypeScript + Tailwind CSS
* **Backend:** Supabase (PostgreSQL)
* **Build Tool:** Vite

## ⚙️ Setup

```bash
npm install
npm run dev
```

Then open your browser at the provided localhost URL.

## 📁 Structure

```
src/
 ├─ components/
 ├─ services/
 ├─ types/
 ├─ lib/
 └─ pages/
```

## 🧩 Workflow

1. AI agent handles calls and escalates unknown questions.
2. Supervisor responds in dashboard.
3. System updates knowledge base automatically.
4. Future queries are answered instantly.

## ✅ Status

* [x] Core features implemented
* [ ] Add authentication
* [ ] Add real-time subscriptions
* [ ] Add tests & monitoring

---

