# Mayne Island Rideshare — Architecture

This document describes the structure and data flows of the application using flowcharts and schematics. All diagrams use [Mermaid](https://mermaid.js.org/) and render directly in GitHub.

---

## 1. High-Level System Overview

```mermaid
graph TB
    subgraph Browser["Browser (Next.js Client Components)"]
        subgraph Providers["React Context Providers (layout.tsx)"]
            AC["AuthContext\n─────────────\nuser: UserProfile\nisLoading: boolean\nlogin / register\nlogout / updateProfile"]
            DC["DataContext\n─────────────\nrideRequests[ ]\ndriverTrips[ ]\ncreate / confirm\ncancel / delete"]
        end

        subgraph Pages["Pages (Next.js App Router)"]
            P0["/ Landing"]
            P1["/auth/login"]
            P2["/auth/register"]
            P3["/rider"]
            P4["/driver"]
            P5["/board"]
            P6["/map"]
            P7["/profile"]
            P8["/emergency"]
        end

        subgraph Components["Shared Components"]
            H["Header\n(nav + logout)"]
            RRC["RideRequestCard"]
            TC["TripCard\n+ social share"]
            MC["Map\n(Leaflet – lazy)"]
        end

        LIB["src/lib/supabase.ts\ncreateClient()"]
    end

    subgraph Supabase["Supabase (Backend)"]
        SBAUTH["Supabase Auth"]
        SBDB["PostgreSQL\nprofiles\nride_requests\ndriver_trips"]
        SBRT["Realtime\npostgres_changes"]
    end

    subgraph External["External Services"]
        OSM["OpenStreetMap\n(map tiles)"]
        GM["Google Maps\n(route export)"]
        WZ["Waze\n(route export)"]
        FB["Facebook Share"]
        TW["Twitter / X Share"]
        WA["WhatsApp Share"]
    end

    AC <-->|"signIn / signUp / signOut"| SBAUTH
    DC <-->|"select / insert / update / delete"| SBDB
    DC <-->|"Realtime subscriptions"| SBRT
    AC --> LIB
    DC --> LIB
    Pages -->|"useAuth()"| AC
    Pages -->|"useData()"| DC
    Pages --> H
    Pages --> RRC
    Pages --> TC
    Pages --> MC
    MC -->|"tiles"| OSM
    MC -->|"deep-link"| GM
    MC -->|"deep-link"| WZ
    TC -->|"share URL"| FB
    TC -->|"share URL"| TW
    TC -->|"share URL"| WA
```

---

## 2. Page & Component Tree

```mermaid
graph TD
    LY["layout.tsx\n AuthProvider + DataProvider"]

    LY --> HOME["/  Landing page"]
    LY --> LOGIN["/auth/login"]
    LY --> REG["/auth/register"]
    LY --> RIDER["/rider  🔒"]
    LY --> DRIVER["/driver  🔒"]
    LY --> BOARD["/board"]
    LY --> MAP["/map"]
    LY --> PROFILE["/profile  🔒"]
    LY --> EMERGENCY["/emergency"]

    RIDER   --> RRC1["RideRequestCard\n(my requests)"]
    RIDER   --> TC1["TripCard\n(available trips)"]
    DRIVER  --> RRC2["RideRequestCard\n(pending requests)"]
    DRIVER  --> TC2["TripCard\n(my posted trips)"]
    BOARD   --> TC3["TripCard\n(all active trips)"]
    MAP     --> MC["Map component\n(Leaflet – dynamic import)"]
    EMERGENCY --> RRC3["Active ride info\n(inline)"]

    style RIDER    fill:#fef3c7,stroke:#d97706
    style DRIVER   fill:#fef3c7,stroke:#d97706
    style PROFILE  fill:#fef3c7,stroke:#d97706

    classDef lock fill:#fef3c7,stroke:#d97706
    class RIDER,DRIVER,PROFILE lock
```

> 🔒 = requires authentication. The page checks `isLoading` (set by Supabase's `onAuthStateChange`) before redirecting.

---

## 3. Authentication Flow

```mermaid
flowchart TD
    A([User visits any page]) --> B{Authenticated?\nSupabase session}
    B -->|"Yes – active session"| C{Role?}
    B -->|"No"| D[Show public page\nor redirect to /auth/login]

    C -->|rider| E["/rider dashboard"]
    C -->|driver| F["/driver dashboard"]
    C -->|both| G["/rider dashboard\n(can also visit /driver)"]

    D --> H{Register or Login?}
    H -->|Register| I["/auth/register\nfill name, email, phone\npassword, role\nvehicle / rider prefs"]
    H -->|Login| J["/auth/login\nemail + password"]

    I --> K["register()\n→ supabase.auth.signUp()\n→ insert into profiles table"]
    J --> L["login()\n→ supabase.auth.signInWithPassword()\n→ fetch profile row"]

    K --> M["onAuthStateChange fires\n→ load profile → set user state"]
    L --> M
    M --> C

    style I fill:#d1fae5,stroke:#059669
    style J fill:#d1fae5,stroke:#059669
    style K fill:#bfdbfe,stroke:#2563eb
    style L fill:#bfdbfe,stroke:#2563eb
```

---

## 4. Ride Request Lifecycle

```mermaid
sequenceDiagram
    participant R  as Rider (/rider)
    participant DC as DataContext
    participant SB as Supabase DB + Realtime
    participant D  as Driver (/driver)
    participant E  as Emergency page

    R->>DC: createRideRequest(pickup, destination, needs)
    DC->>SB: INSERT into ride_requests (status = "pending")
    SB-->>DC: postgres_changes event fires
    DC->>SB: SELECT ride_requests (reload)
    SB-->>DC: updated rideRequests[]

    D->>DC: useData() – sees pending requests
    DC-->>D: rideRequests[] (status = "pending")
    D->>DC: confirmRideRequest(requestId, driverId, name, phone, vehicle)
    DC->>SB: UPDATE ride_requests SET status = "confirmed" + driver info
    SB-->>DC: postgres_changes event fires → reload
    DC-->>R: RideRequestCard re-renders\nshows driver name / phone / vehicle

    R->>E: visits /emergency
    E->>DC: finds confirmed ride for user
    DC-->>E: shows driver contact info inline

    note over R,D: Either party can call 911 / RCMP\nfrom the Emergency page at any time
```

---

## 5. Driver Trip (Message Board) Flow

```mermaid
flowchart LR
    subgraph DriverDash["/driver dashboard"]
        FORM["Post Trip form\n─────────────\ndeparture location\ndestination\ntime, seats\nnotes"]
        MYTRIPS["My Posted Trips\n(TripCard × n)"]
    end

    subgraph Board["/board  Community Message Board"]
        ALL["All Active Trips\n(TripCard × n)"]
    end

    subgraph Share["Social Sharing (TripCard)"]
        COPY["📋 Copy link"]
        FB["📘 Facebook"]
        TW["🐦 Twitter / X"]
        WA["💬 WhatsApp"]
    end

    subgraph Map["/map  Route Planner"]
        LEAF["Leaflet map\nMayne Island landmarks"]
        GM["Open in Google Maps"]
        WAZE["Open in Waze"]
    end

    FORM -->|"createDriverTrip()"| DC[(DataContext\nlocalStorage)]
    DC --> MYTRIPS
    DC --> ALL
    ALL --> Share
    MYTRIPS -->|"deleteDriverTrip()"| DC
    Board -->|"deeplink to route"| Map
    LEAF --> GM
    LEAF --> WAZE
```

---

## 6. Data Layer

```mermaid
erDiagram
    UserProfile {
        string uid PK
        string name
        string email
        string phone
        string role "rider | driver | both"
        string vehicleDescription
        string petsAllowed "yes | no | case-by-case"
        int    childSeatsAvailable
        bool   wheelchairAccessible
        string cargoCapacity
        object emergencyContact
        bool   hasPet
        bool   needsChildSeat
        bool   needsWheelchairAccess
        string cargoNeeds
        date   createdAt
    }

    RideRequest {
        string id PK
        string riderId   FK
        string riderName
        string riderPhone
        string destination
        string pickupLocation
        string notes
        bool   hasPet
        bool   needsChildSeat
        bool   needsWheelchairAccess
        string cargoDescription
        string status "pending | confirmed | completed | cancelled"
        string confirmedDriverId
        string confirmedDriverName
        string confirmedDriverPhone
        string confirmedDriverVehicle
        date   createdAt
    }

    DriverTrip {
        string id PK
        string driverId FK
        string driverName
        string driverPhone
        string destination
        string departureTime
        string departureLocation
        int    availableSeats
        bool   petsAllowed
        int    childSeatsAvailable
        bool   wheelchairAccessible
        string notes
        string status "active | full | completed"
        date   createdAt
    }

    UserProfile ||--o{ RideRequest  : "rider submits"
    UserProfile ||--o{ DriverTrip   : "driver posts"
    UserProfile ||--o{ RideRequest  : "driver confirms"
```

---

## 7. Role-Based Access Matrix

```mermaid
graph LR
    subgraph Roles
        RO["🧍 Rider"]
        DR["🚗 Driver"]
        BO["🧍🚗 Both"]
        GU["👤 Guest\n(not logged in)"]
    end

    subgraph Routes
        HOME["/ Landing"]
        LOGIN["/auth/login"]
        REG["/auth/register"]
        RIDER["/rider"]
        DRIVER["/driver"]
        BOARD["/board"]
        MAP["/map"]
        EMER["/emergency"]
        PROF["/profile"]
    end

    RO  -->|"✅ full access"| RIDER
    RO  -->|"❌ redirect /rider"| DRIVER
    DR  -->|"❌ redirect /driver"| RIDER
    DR  -->|"✅ full access"| DRIVER
    BO  -->|"✅ full access"| RIDER
    BO  -->|"✅ full access"| DRIVER
    GU  -->|"❌ redirect /auth/login"| RIDER
    GU  -->|"❌ redirect /auth/login"| DRIVER
    GU  -->|"❌ redirect /auth/login"| PROF

    RO  -->|"✅"| BOARD
    DR  -->|"✅"| BOARD
    BO  -->|"✅"| BOARD
    GU  -->|"✅ read-only"| BOARD

    RO  -->|"✅"| MAP
    DR  -->|"✅"| MAP
    BO  -->|"✅"| MAP
    GU  -->|"✅"| MAP

    RO  -->|"✅"| EMER
    DR  -->|"✅"| EMER
    BO  -->|"✅"| EMER
    GU  -->|"✅"| EMER

    RO  -->|"✅"| PROF
    DR  -->|"✅"| PROF
    BO  -->|"✅"| PROF
```

---

## 8. Deployment: Supabase + Vercel

The app uses **Supabase** for auth, PostgreSQL storage, and real-time sync, and **Vercel** for hosting.

```mermaid
flowchart LR
    subgraph Supabase["Supabase (backend)"]
        SA["Supabase Auth\n(email + password)"]
        PG["PostgreSQL\nprofiles\nride_requests\ndriver_trips"]
        RT["Supabase Realtime\npostgres_changes\nsubscriptions"]
        RLS["Row-Level Security\npolicies"]
    end

    subgraph App["Next.js App"]
        AC["AuthContext\nsupabase.auth.*"]
        DC["DataContext\nsupabase.from().*\n+ Realtime channels"]
        LIB["src/lib/supabase.ts\ncreateClient()"]
    end

    subgraph Hosting["Vercel"]
        VD["Vercel Dashboard\nEnv Vars"]
        INT["Supabase Vercel\nIntegration\n(auto-sets env vars)"]
    end

    subgraph ENV[".env.local"]
        URL["NEXT_PUBLIC_SUPABASE_URL"]
        KEY["NEXT_PUBLIC_SUPABASE_ANON_KEY"]
    end

    AC  -->|"signIn / signUp / signOut"| SA
    DC  -->|"select / insert / update / delete"| PG
    DC  -->|"channel subscriptions"| RT
    PG  -->|"enforces"| RLS
    LIB -->|"reads"| ENV
    INT -->|"populates"| VD
    VD  -->|"injects at build"| ENV
```

> **Required `.env.local` keys** (see `.env.example`):
> `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
>
> Run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL Editor to create all tables, RLS policies, and Realtime publications.
