# Mayne Island Rideshare - Quick Start Guide

## 🚀 Getting Started (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

**That's it!** The app runs in demo mode using localStorage - no additional configuration needed.

---

## 📋 Features Demo

### Try These Flows:

#### As a Rider:
1. Click "Sign Up" → Register as a Rider
2. Fill out your profile (name, email, phone)
3. You'll be redirected to the Rider Dashboard
4. Submit a ride request with:
   - Pickup location
   - Destination
   - Special needs (pets, child seats, wheelchair, cargo)
5. Wait for a driver to confirm (in demo mode, you'd register as a driver in another browser/incognito window)

#### As a Driver:
1. Click "Sign Up" → Register as a Driver
2. Fill out vehicle details (description, pets allowed, child seats, etc.)
3. You'll see the Driver Dashboard
4. View pending ride requests from riders
5. Click "Confirm & Contact Rider" on any request
6. Post your own trip:
   - Where you're going
   - When you're leaving
   - Available seats

#### Community Features:
- **Message Board** (`/board`): See all driver trips, share to social media
- **Map** (`/map`): Plan routes, click to set start/end points, export to Google Maps/Waze
- **Profile** (`/profile`): Update your preferences anytime
- **Emergency** (`/emergency`): Access emergency contacts, safety guidelines

---

## 🔄 Setup: Supabase + Vercel

### Supabase (backend)

1. Create a free project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run the contents of [`supabase/schema.sql`](./supabase/schema.sql)
   — this creates the `profiles`, `ride_requests`, and `driver_trips` tables with RLS policies and Realtime enabled.
3. In **Project Settings → Authentication → Email**, disable "Confirm email" for development (optional but convenient).
4. In **Project Settings → API**, copy your **Project URL** and **anon/public key**.

### Local development

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Then start the dev server:

```bash
npm run dev
```

### Vercel deployment

The easiest way is to use the official **[Supabase Vercel Integration](https://vercel.com/integrations/supabase)** — it automatically adds `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to your Vercel project.

Alternatively, add the two environment variables manually in **Vercel Dashboard → Project → Settings → Environment Variables**.

Then deploy:

```bash
# Via Vercel CLI
npx vercel --prod

# Or connect your GitHub repo in the Vercel dashboard for automatic deploys
```

---

## 🎯 Testing Multiple Users

To test the full experience:

1. **Browser 1 (Normal)**: Register as a Rider, submit ride request
2. **Browser 2 (Incognito)**: Register as a Driver, see the request, confirm it
3. **Browser 1**: See the driver's details appear in real-time!

Both browsers connect to the same Supabase project — no refresh needed, changes sync instantly via Supabase Realtime.

---

## 📦 Production Build

```bash
npm run build
npm start
```

Access at [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Tech Stack

- **Next.js** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Leaflet** - Open-source maps
- **Lucide React** - Icons
- **Supabase** - Auth, PostgreSQL database, and Realtime subscriptions

---

## 📱 Mobile Testing

The app is mobile-first! Test on your phone:

1. Run dev server: `npm run dev`
2. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. On phone, navigate to `http://YOUR-IP:3000`

---

## ❓ Troubleshooting

### "Module not found" errors
```bash
npm install
```

### Build fails
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

---

## 📄 Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── auth/              # Login & Register
│   ├── rider/             # Rider dashboard
│   ├── driver/            # Driver dashboard
│   ├── board/             # Message board
│   ├── map/               # Interactive map
│   ├── profile/           # User profile
│   └── emergency/         # Emergency info
├── components/            # Reusable components
├── contexts/              # React context (state)
├── types/                 # TypeScript types
└── lib/                   # Utilities
```

---

## 🌟 Key Features

✅ Real-time ride requests  
✅ Driver trip posts with social sharing  
✅ Interactive maps with route planning  
✅ Support for pets, child seats, wheelchair, cargo  
✅ Emergency contacts & safety info  
✅ Profile management  
✅ Mobile-first responsive design  
✅ Supabase Auth + PostgreSQL + Realtime  
✅ Deploy to Vercel in minutes  

---

**Enjoy building community connections on Mayne Island! 🏝️🚗**
