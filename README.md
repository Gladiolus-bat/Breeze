# Breeze

A hotel booking app. Users can browse rooms, check dates, and book a stay; hotel owners
can list their place, add rooms, and keep an eye on bookings and revenue.

## Stack

React (Vite) + Tailwind on the frontend, Express + MongoDB on the backend, JWT for auth,
Cloudinary for image uploads.

## Project Structure

```
Breeze/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── api/            # fetch wrappers for the backend (auth, rooms, hotels, bookings)
│       ├── components/
│       │   ├── auth/       # Login / Register forms
│       │   ├── layout/     # Navbar, Footer
│       │   ├── owner/      # Owner dashboard: add/edit/manage rooms, hotel bookings
│       │   ├── pages/      # Home, Rooms, Room Detail, My Bookings, Profile, Become Host
│       │   └── rooms/      # Shared RoomCard
│       ├── context/        # AuthContext (session/token), NavContext (in-app navigation)
│       └── assets/         # Logo, hero illustration
│
└── server/                 # Express backend
    ├── configs/            # DB connection, Cloudinary config
    ├── controllers/        # Route handlers (user, hotel, room, booking)
    ├── middleware/         # JWT auth (protect/restrictTo), Multer upload
    ├── models/             # Mongoose schemas: User, Hotel, Room, Booking
    ├── routes/
    └── utils/              # Shared Cloudinary upload helper
```

## Getting Started

### Server

```bash
cd server
npm install
```

You'll need a `.env` file in `server/`:

```
MONGODB_URI=mongodb://127.0.0.1:27017      # or your MongoDB Atlas URI
JWT_SECRET=your-long-random-secret
PORT=3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Then:

```bash
npm run server   # nodemon, restarts on changes
# or
npm start
```

### Client

```bash
cd client
npm install
```

`.env` in `client/`:

```
VITE_API_URL=http://localhost:3000/api/user
VITE_API_ROOT=http://localhost:3000/api
```

```bash
npm run dev
```

Just make sure the server's actually running on the port above first — CORS is wide open
for local dev, so that part won't trip you up.

## API

Everything's under `/api`. Routes marked "admin" need the user's role to be `admin`,
which happens automatically the first time they register a hotel.

### User — `/api/user`
| Method | Route | Auth | What it does |
|---|---|---|---|
| POST | `/register` | — | Create an account |
| POST | `/login` | — | Log in, get a JWT back |
| GET | `/` | required | Current user's profile |
| PUT | `/profile` | required | Update username and/or profile picture |
| PUT | `/change-password` | required | Change password (needs the current one) |
| POST | `/store-recent-search` | required | Track a recently searched city |

### Hotels — `/api/hotels`
| Method | Route | Auth | What it does |
|---|---|---|---|
| POST | `/` | required | Register a hotel — this is what promotes the user to `admin` |

### Rooms — `/api/rooms`
| Method | Route | Auth | What it does |
|---|---|---|---|
| GET | `/` | — | List available rooms |
| GET | `/owner` | admin | List the caller's own hotel's rooms |
| POST | `/` | admin | Create a room (multipart, up to 4 images) |
| PUT | `/:roomId` | admin | Update a room — images are optional, omit them to keep the existing ones |
| POST | `/toggle-availability` | admin | Flip a room's availability on/off |

### Bookings — `/api/bookings`
| Method | Route | Auth | What it does |
|---|---|---|---|
| POST | `/check-availability` | — | Check if a room's free for given dates |
| POST | `/book` | required | Create a booking |
| GET | `/user` | required | The current user's bookings |
| GET | `/hotel` | admin | The caller's hotel's bookings + revenue |

## A couple of things worth knowing

There's no `react-router` in here — navigation between pages is handled by a small custom
`NavContext` that just swaps components in and out based on in-memory state. It works fine,
but it means no real URLs for individual pages and no browser back/forward support yet.
Worth keeping in mind if the app grows and deep-linking starts to matter.

Room images and profile pictures go straight to Cloudinary via Multer's in-memory storage —
nothing gets written to disk on the server.

---

<div align="center">

*Developed for the Summer Industry Enrichment Classes (FullStack) — Islington College Kathmandu*

</div>
