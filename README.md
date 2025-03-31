
# Player Rankings Frontend

This is the frontend interface for the Player Rankings System, built using Next.js and styled with Tailwind CSS.

## Features

- 🔐 Login/Logout with token-based local auth
- 📈 Leaderboard view
- 🎾 Match Management (Add, Edit, Delete Matches)
- 👥 Player Management (Add, Edit, Delete Players)
- 🏆 Tournament Management:
  - Tournament list and detail views
  - Tournament creation UI with grouped player selection
  - Group stage match result submission
  - Live group standings
  - Full knockout bracket visualization
  - 3rd place match display
  - Final standings display
  - Admin-only controls

---

## 🧠 Tournament System UI

### 1. Tournament List

Accessible at `/tournaments`. Displays all tournaments.

### 2. Tournament Creation

Accessible to admins. Inputs:
- Tournament name
- Date
- Number of groups
- Players per group advancing
- Player checklist to select participants

System auto-generates group matchups and knockout bracket.

---

### 3. Group Stage UI

- Displays players divided into groups
- Each group has a match table
- Admin inputs winner, scores, and per-set details
- Rankings auto-update and show:
  - Wins
  - Head-to-head
  - Set and point difference

---

### 4. Knockout Stage UI

- Visual bracket using all pre-generated matches
- Each round shown with match slots and scores
- Final and 3rd place matches rendered clearly
- Rankings locked in after finals

---

### 5. Navigation

Navbar updated with:
- `/matches/add-matches`, `/matches/delete-matches`, `/matches/edit-matches`
- `/players/add-players`, `/players/delete-players`, `/players/edit-players`
- `/tournaments` — tournament list

All pages check for local auth token to guard admin-only actions.

---

## Dev Setup

```bash
npm install
npm run dev
```

Make sure backend is running and CORS is configured properly.