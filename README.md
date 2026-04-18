# Jotform Frontend Challenge Project

- **Name**: Sahra SARI

## Setup Instructions

### 1. Environment Variables

Copy the `.env.example` file to create your `.env` file:

```bash
cp .env.example .env
```

Then fill in your Jotform credentials:

```env
VITE_JOTFORM_API_KEY=your_api_key_here

VITE_FORM_ID_CHECKINS=261065067494966
VITE_FORM_ID_MESSAGES=261065765723966
VITE_FORM_ID_SIGHTINGS=261065244786967
VITE_FORM_ID_PERSONAL_NOTES=261065509008958
VITE_FORM_ID_ANONYMOUS_TIPS=261065875889981
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

---

## Project Overview

This is an **investigation tracker application** that helps solve a missing pet case by aggregating and visualizing data from Jotform submissions.

### Dashboard

The landing page displays three investigation cards linking to the main sections of the app.

### Investigation Sections

**📍 Check-ins** - Explore where people were and when they checked in. Features an interactive map, timeline view, and advanced search by person, location, or date range.

**💬 Messages** - Track conversations between people. Organized by conversation threads with a full message timeline and search capabilities.

**👥 Sightings** - Discover who was seen with whom and where. Interactive map visualization with evidence linking to personal notes and anonymous tips.

### Key Features

- Real-time data from Jotform API
- Interactive maps with location pins
- Advanced search & filtering (person, location, date range)
- Evidence system linking personal notes and anonymous tips
- Responsive design for desktop and mobile
- Autocomplete suggestions for quick filtering

### 🔍 Note :

The dashboard utilizes a relational engine that automatically links events with personal notes and anonymous tips based on person entities and geographic locations.
By clicking the investigation icon, the system dynamically filters disparate intelligence sources to surface only the most relevant insights for a specific event or person.

If mentioned people, location and time all matches, then it gives a warning.

<img width="2505" height="1485" alt="image" src="https://github.com/user-attachments/assets/a1da761e-f945-43c3-a549-6877068d34e3" />
