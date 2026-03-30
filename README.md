# Mayne Island Rideshare 🚗🌊

A free, volunteer-driven community rideshare application for Mayne Island, BC. This app connects neighbors who need rides with volunteer drivers, fostering a strong sense of community and making transportation accessible for everyone on the island.

## 🌟 Features

### For Riders
- **Request Rides**: Submit ride requests with pickup and destination locations
- **Special Needs Support**: Specify requirements for pets, child seats, wheelchair accessibility, and cargo
- **Real-time Notifications**: All registered drivers are notified instantly when you request a ride
- **Driver Confirmation**: Get driver contact info when someone confirms your ride
- **View Available Trips**: See upcoming trips posted by drivers on the message board

### For Drivers
- **See All Requests**: View all pending ride requests from community members in real-time
- **Confirm Rides**: Help neighbors by confirming rides you can provide
- **Post Trips**: Share your planned trips with available seats on the community message board
- **Vehicle Profile**: Set your accommodations (pets, child seats, wheelchair access, cargo capacity)

### Community Features
- **Message Board**: Drivers post upcoming trips that anyone can view and share
- **Social Sharing**: Share trips to Facebook, Twitter, WhatsApp, or copy links
- **Interactive Map**: Plan routes with Leaflet.js, export to Google Maps or Waze
- **Emergency Page**: Quick access to emergency contacts and safety information
- **Profile Management**: Update your preferences and vehicle details anytime

### Safety & Inclusivity
- Emergency contact support for drivers
- Wheelchair accessibility options
- Pet-friendly ride matching
- Child seat availability tracking
- Community guidelines and safety tips

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet.js (React Leaflet)
- **Icons**: Lucide React
- **Authentication**: Supabase Auth (email + password)
- **Database**: Supabase PostgreSQL with Realtime subscriptions

## 🗂️ Architecture

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for full Mermaid flowcharts covering:

- High-level system overview (pages, contexts, localStorage, external services)
- Page & component tree
- Authentication flow
- Ride request lifecycle (rider → driver → confirmation)
- Driver trip & message board flow
- Entity-relationship diagram for all data types
- Role-based access matrix
- Production upgrade path (Supabase + Vercel)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Mayne-Island-Rideshare.git
cd Mayne-Island-Rideshare
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Copy `.env.example` to `.env.local` and add your [Supabase](https://supabase.com) credentials:
   ```bash
   cp .env.example .env.local
   ```
5. Run the SQL schema in the **Supabase SQL Editor**:
   ```bash
   # Paste the contents of supabase/schema.sql
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Deploy to Vercel

1. Push the repo to GitHub
2. Import the project in the [Vercel Dashboard](https://vercel.com)
3. Add the Supabase env vars (or use the [Supabase Vercel Integration](https://vercel.com/integrations/supabase))
4. Deploy! 🚀

### Production Build (local)

```bash
npm run build
npm start
```

## 🔑 Supabase Setup

This app uses [Supabase](https://supabase.com) for authentication, data storage, and real-time updates:

1. Create a free Supabase project at [supabase.com](https://supabase.com)
2. Run [`supabase/schema.sql`](./supabase/schema.sql) in the **SQL Editor** — creates the `profiles`, `ride_requests`, and `driver_trips` tables with RLS policies and Realtime enabled
3. In **Project Settings → Authentication → Email**, you can disable "Confirm email" for easier local testing
4. Copy your **Project URL** and **anon key** from **Project Settings → API** into `.env.local`

## 📱 Pages & Routes

- **`/`** - Landing page with community info and how-it-works
- **`/auth/login`** - User login
- **`/auth/register`** - User registration with role selection
- **`/rider`** - Rider dashboard to request rides
- **`/driver`** - Driver dashboard to see requests and post trips
- **`/board`** - Community message board with all driver trips
- **`/map`** - Interactive map with route planning
- **`/profile`** - User profile management
- **`/emergency`** - Emergency contacts and safety info

## 🎨 Design Philosophy

This app is designed with Mayne Island's community values in mind:

- **100% Free & Volunteer**: just neighbors helping neighbors. Tips accepted.
- **Accessible**: Support for various needs (pets, mobility, children, cargo)
- **Transparent**: All ride requests visible to all drivers
- **Safe**: Emergency contacts, safety guidelines, and community accountability
- **Mobile-First**: Optimized for phones since many people will use it on-the-go

## 🤝 Community Guidelines

- **Respect**: Be courteous to all community members
- **Communication**: Clearly communicate needs and availability
- **Punctuality**: Be on time and notify if plans change
- **Safety**: Drivers must have valid license and insurance
- **Free Service**: This is volunteer-based - no payment required 
- **Trust**: Build community through reliable, friendly service

## 📝 Development

### Project Structure
```
src/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── rider/             # Rider dashboard
│   ├── driver/            # Driver dashboard
│   ├── board/             # Message board
│   ├── map/               # Interactive map
│   ├── profile/           # User profile
│   └── emergency/         # Emergency info
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── Map.tsx            # Leaflet map component
│   ├── RideRequestCard.tsx
│   └── TripCard.tsx
├── contexts/              # React contexts
│   ├── AuthContext.tsx    # Authentication state
│   └── DataContext.tsx    # Ride/trip data state
├── types/                 # TypeScript type definitions
└── lib/                   # Utility functions
```

### Key Technologies

- **Next.js 15**: Latest features with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling with custom color palette
- **Leaflet**: Open-source maps (no API key needed!)
- **React Context**: State management for auth and data
- **localStorage**: Demo mode data persistence

## 🗺️ Roadmap

Future enhancements could include:
- [ ] Push notifications for ride requests
- [ ] Ratings and feedback system
- [ ] Recurring ride schedules
- [ ] Integration with ferry schedules
- [ ] SMS notifications option
- [ ] Admin dashboard for community moderators
- [ ] Connecting with MIALS drive program
- [ ] CSA delivery
- [ ] How to integrate w/Mayne Island Express Courier

## 📄 License

[Add your license here]

## 🙏 Acknowledgments

Built with ❤️ for the Mayne Island community.

Special thanks to all volunteer drivers who make this service possible!

## 📞 Support

For questions or issues:
- Open a GitHub issue
- Contact the Mayne Island community administrators

---

**Remember**: This is a volunteer community service. Be kind, be safe, and help make Mayne Island more connected! 🏝️
# Mayne-Island-Rideshare
This repo holds the software for a ridesharing app focused on Mayne Island BC.  Connecting drivers with passengers (tips encouraged) and vice versa.  Cargo, ferry runs and deliveries too

It should be like uber but free
