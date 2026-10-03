# ⚡ PANEL LAB — AI Panel Generation & Battle Engine

**Panel Lab** is an entertainment-driven AI product and personality simulation platform built on a verified dataset of **2,000 public figures** across Indian comedy, internet culture, cinema, music, and sports.

---

## 🌟 Key Features

### 1. 🔮 AI Panel Generation
- **Vibe Targeting**: Choose between 6 distinct entertainment atmospheres:
  - **Chaotic**: Maximum unpredictability, chaos, and personality clash.
  - **Safe**: High chemistry, mainstream appeal, low controversy.
  - **Dark**: Roast-heavy, edgy, cynical humor.
  - **Viral**: Maximum meme potential, internet-native energy.
  - **Unhinged**: Extreme improvisation and eccentric contrast.
  - **Balanced**: Well-rounded comedy, celebrity power, and latent fit.
- **Configurable Lineup Sizes**: 4, 5, or 6 public figures.
- **Algorithmic Candidate Sampling**: Generates 60 permutations, ranks them by pair-level chemistry and vibe affinity, and feeds the top candidates to Gemini AI.
- **Gemini AI Judge**: Analyzes interpersonal dynamics and selects the optimal lineup with commentary and key highlights.
- **Interactive Lineup Studio**: Lock anchor members, swap individual guests, or inspect in-depth dossiers.

### 2. 🧩 Complete My Panel (Co-Pilot)
- Lock 1 to 4 anchor public figures.
- The engine computes pairwise chemistry matrices across the 2,000-person database.
- AI recommends complementary co-stars that maximize overall panel chemistry and adhere to the target vibe.

### 3. ⚔️ Panel Battle Arena
- Pit two rival lineups (Panel A vs. Panel B) in a head-to-head entertainment clash.
- Auto-draft rival teams or build custom squads.
- Side-by-side metric comparison across Chaos, Comedy, Viral Index, and Chemistry.
- Gemini AI acts as referee, providing round-by-round commentary and declaring the victor.

### 4. 🗂️ 2,000 Verified Public Figure Roster
- Instant search and category filtering across comedians, creators, actors, musicians, and athletes.
- Sort by any of the 13 verified metrics (Comedy, Chaos, Roastability, Energy, Viral Potential, Latent Fit).
- Comprehensive **Persona Dossier** with visual metric breakdowns and platform footprint.

### 5. 💾 Saved Lineups & Export
- Save high-chemistry lineups locally in browser storage.
- One-click copy lineup formatted for sharing.
- Re-load saved panels back into the studio for further customization.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom dark mode glassmorphism & gradients
- **AI Integration**: Google Gemini API (`gemini-2.0-flash`) with fallback
- **Icons**: Lucide React
- **Dataset**: 2,000 verified public figures loaded and cached server-side (`data/samay_panel_people.csv`)

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
cd panel-lab
npm install
```

### 2. Configure Environment Variables

Create `.env.local` based on `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

*(Note: Even without an API key, Panel Lab's algorithmic scoring engine automatically handles panel selection and battle judging using mathematical heuristics.)*

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## 📐 Algorithmic Scoring & Chemistry Engine

Each public figure is indexed across 13 core dimensions (0–100):
- `comedy_score`, `chaos_score`, `roastability`, `controversy_level`, `energy_level`, `seriousness`, `meme_factor`, `viral_potential`, `unpredictability`, `improvisation`, `internet_native`, `celebrity_factor`, `latent_fit`.

Pairwise chemistry $C(A, B)$ combines:
1. **Comedy Synergy**: Compatibility in delivery and timing.
2. **Energy Contrast**: Complementary pacing (calm vs. explosive).
3. **Category Diversity**: Cross-industry collisions (e.g. comedian + athlete).
4. **Roast Compatibility**: Mutual vulnerability and banter resilience.
5. **Personality Contrast**: Divergent comedic axes yielding entertaining tension.

---

## 📄 License

MIT License. Designed and built for entertainment panel simulation.
