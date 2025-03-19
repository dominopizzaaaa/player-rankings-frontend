# Player Rankings Frontend

## Overview

The frontend of the Player Rankings system is developed using **Next.js** (React framework) and **Tailwind CSS**. It provides an interactive UI for managing players, matches, and rankings. The frontend communicates with a **FastAPI backend** to fetch, update, and submit data.

## Technologies Used

- **Next.js** (React framework) – for SSR (Server-Side Rendering) and CSR (Client-Side Rendering)
- **React Hooks** (useState, useEffect, useContext) – for state management
- **Tailwind CSS** – for styling
- **React Bootstrap** – for UI components
- **Fetch API / REST API Calls** – for communication with the backend
- **Local Storage** – for storing authentication tokens

## Hosting & Deployment

The frontend is deployed on **Vercel** for seamless hosting, CI/CD, and automatic updates. The deployment workflow is set up to track changes in the main branch of the repository, ensuring the latest features are always live.

## Features

### 🏆 Player Leaderboard
- Displays the ranking of players based on Elo rating.
- Players are sorted dynamically based on their performance.
- Clicking a player's name navigates to their profile.

### 🔄 Authentication & Admin Privileges
- Only admins can **add, edit, and delete players and matches**.
- Uses **JWT authentication** for login sessions.
- Token is stored in **localStorage** and used in API requests for authorization.

### 🎮 Match Submission
- Allows submitting match results, updating **Elo ratings**.
- Validates player selection to prevent duplicate entries.

### 🏓 Player Management
- **Add Players**: Create a new player with name, handedness, rubbers, blade, and rating.
- **Edit Players**: Modify player details (only available for admins).
- **Delete Players**: Remove a player and their match history.

### 📝 Match Management
- **Edit Matches**: Modify match details, including scores and winners.
- **Delete Matches**: Remove matches from history.

### 🔀 API Integration
- Fetches player and match data dynamically from the backend.
- Uses **fetch API** with authentication headers.

## Methods & API Calls

### Authentication
- **Login API**: `POST /token` (sends username and password to get a JWT token)
- **Logout**: Clears the localStorage token.

### Player APIs
- **GET /players** → Fetch all players
- **POST /players** → Add new player
- **PATCH /players/{id}** → Update player details
- **DELETE /players/{id}** → Delete a player

### Match APIs
- **GET /matches** → Fetch all matches
- **POST /matches** → Submit a match result
- **PATCH /matches/{id}** → Update match details
- **DELETE /matches/{id}** → Delete a match

## Deployment Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/player-rankings-frontend.git
   ```

2. Install dependencies:
   ```sh
   cd player-rankings-frontend
   npm install
   ```

3. Create `.env.local` with backend API URL:
   ```sh
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
   ```

4. Run the development server:
   ```sh
   npm run dev
   ```

5. Deploy to **Vercel**:
   ```sh
   vercel
   ```

This frontend provides a **fast, responsive, and secure** experience for managing Elo rankings. 🚀
