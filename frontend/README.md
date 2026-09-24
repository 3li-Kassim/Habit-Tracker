# Habit Tracker

A full-stack habit tracking app that lets you create habits, mark them complete each day, and visualize your consistency over time — including automatic streak calculation and a 90-day activity grid inspired by GitHub's contribution graph.

## Features

- **Create and delete habits**
- **Mark habits complete** for the day, with duplicate-completion protection
- **Automatic streak calculation** — tracks current consecutive-day streaks and correctly resets when a day is missed
- **90-day activity grid** — a visual, color-coded grid showing completion history at a glance
- **REST API** built with Express, backed by a PostgreSQL database

## Tech Stack

**Frontend:** React (Vite), Bootstrap  
**Backend:** Node.js, Express  
**Database:** PostgreSQL

## How it works

The backend exposes a REST API for managing habits and their daily completions. Completions are stored as individual date records rather than a simple boolean, which allows the app to calculate streaks and build the activity grid directly from real completion history rather than a static flag.

- `GET /api/habits` — list all habits
- `POST /api/habits` — create a new habit
- `POST /api/habits/:id/complete` — mark a habit complete for today
- `DELETE /api/habits/:id` — delete a habit
- `GET /api/habits/:id/streak` — get a habit's current streak
- `GET /api/habits/:id/heapmap` — get a habit's completion history

## Running it locally

**Requirements:** Node.js, PostgreSQL

1. Clone the repo
```bash
   git clone https://github.com/3li-Kassim/Habit-Tracker.git
```

2. Set up the backend
```bash
   cd backend
   npm install
```
   Create a `.env` file in `backend/` with your database connection string:
