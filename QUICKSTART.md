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

## 🔄 Demo Mode vs Firebase

### Demo Mode (Default)
- ✅ Works immediately, no setup
- ✅ Data stored in browser localStorage
- ✅ Real-time simulation with 5-second polling
- ⚠️ Data only visible in your browser
- ⚠️ Cleared when you clear browser data

### Firebase Mode (Optional)
To enable real-time sync across devices:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Copy `.env.example` to `.env.local`
5. Add your Firebase config to `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```
6. Restart dev server: `npm run dev`

---

## 🎯 Testing Multiple Users

To test the full experience:

1. **Browser 1 (Normal)**: Register as a Rider, submit ride request
2. **Browser 2 (Incognito)**: Register as a Driver, see the request, confirm it
3. **Browser 1**: Refresh to see driver confirmed your ride!

Or use multiple browsers/devices on the same network with production build (`npm run build && npm start`).

---

## 📦 Production Build

```bash
npm run build
npm start
```

Access at [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Leaflet** - Open-source maps
- **Lucide React** - Icons
- **Firebase** (optional) - Auth + real-time database

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
✅ Works offline (demo mode)  
✅ Firebase-ready for production  

---

**Enjoy building community connections on Mayne Island! 🏝️🚗**
